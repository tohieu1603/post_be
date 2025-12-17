import mongoose, { Schema, Document, Types } from 'mongoose';

export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  avatar: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, maxlength: 255 },
    passwordHash: { type: String, required: true, maxlength: 255 },
    name: { type: String, required: true, maxlength: 255 },
    avatar: { type: String, default: null, maxlength: 1000 },
    role: { type: String, enum: ['admin', 'editor', 'author', 'viewer'], default: 'viewer' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for activity logs
userSchema.virtual('activityLogs', {
  ref: 'ActivityLog',
  localField: '_id',
  foreignField: 'userId',
});

// Indexes (email already indexed via unique: true)
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
