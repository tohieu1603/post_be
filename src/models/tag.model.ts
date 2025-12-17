import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITag extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, maxlength: 100 },
    description: { type: String, default: null },
    color: { type: String, default: null, maxlength: 7 }, // Hex color
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries (name, slug already indexed via unique: true)
tagSchema.index({ isActive: 1 });

export const Tag = mongoose.model<ITag>('Tag', tagSchema);
