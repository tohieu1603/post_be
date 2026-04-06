import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  parentId: Types.ObjectId | null;
  content: string;
  likes: Types.ObjectId[];
  likesCount: number;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    content: { type: String, required: true, maxlength: 2000, trim: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1 });

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
