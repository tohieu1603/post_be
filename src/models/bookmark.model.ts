import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBookmark extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Each user can bookmark a post only once
bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });
bookmarkSchema.index({ userId: 1, createdAt: -1 });

export const Bookmark = mongoose.model<IBookmark>('Bookmark', bookmarkSchema);
