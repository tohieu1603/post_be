import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string | null;
  parentId: Types.ObjectId | null;
  sortOrder: number;
  isActive: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, maxlength: 255 },
    slug: { type: String, required: true, unique: true, maxlength: 255 },
    description: { type: String, default: null },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    id: true,
  }
);

// Virtual for parent category
categorySchema.virtual('parent', {
  ref: 'Category',
  localField: 'parentId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId',
});

// Virtual for posts
categorySchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'categoryId',
});

// Index for faster queries
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });
categorySchema.index({ isActive: 1 });

export const Category = mongoose.model<ICategory>('Category', categorySchema);
