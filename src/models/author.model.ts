import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Author Model - E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 * Supports Google's quality guidelines for content authors
 */
export interface IAuthor extends Document {
  _id: Types.ObjectId;
  // Basic info
  name: string;
  slug: string;
  email: string | null;
  avatarUrl: string | null;

  // E-E-A-T signals
  bio: string | null;                    // Expertise description
  jobTitle: string | null;               // Chức danh
  credentials: string | null;            // Bằng cấp, chứng chỉ
  yearsExperience: number | null;        // Số năm kinh nghiệm

  // Social proof - Schema.org sameAs
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  facebook: string | null;
  sameAs: string[];                      // Array of social/profile URLs

  // Relation to User (if author is also a system user)
  userId: Types.ObjectId | null;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const authorSchema = new Schema<IAuthor>(
  {
    // Basic info
    name: { type: String, required: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, maxlength: 100 },
    email: { type: String, default: null, maxlength: 255 },
    avatarUrl: { type: String, default: null, maxlength: 500 },

    // E-E-A-T signals
    bio: { type: String, default: null },
    jobTitle: { type: String, default: null, maxlength: 100 },
    credentials: { type: String, default: null, maxlength: 255 },
    yearsExperience: { type: Number, default: null },

    // Social proof
    website: { type: String, default: null, maxlength: 500 },
    twitter: { type: String, default: null, maxlength: 100 },
    linkedin: { type: String, default: null, maxlength: 500 },
    facebook: { type: String, default: null, maxlength: 500 },
    sameAs: [{ type: String }],

    // Relation
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user
authorSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for posts
authorSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'authorId',
});

// Indexes
authorSchema.index({ isActive: 1 });
authorSchema.index({ userId: 1 });

export const Author = mongoose.model<IAuthor>('Author', authorSchema);
