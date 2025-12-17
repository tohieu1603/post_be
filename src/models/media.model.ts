import mongoose, { Schema, Document, Types } from 'mongoose';

export type MediaType = 'image' | 'video' | 'document' | 'audio' | 'other';

export interface MediaUsage {
  entityType: string;
  entityId: string;
  field: string;
}

// Assignment cho page/section
export interface MediaAssignment {
  pageSlug: string;
  sectionKey: string;
  elementId?: string;
}

export interface IMedia extends Document {
  _id: Types.ObjectId;
  filename: string;
  originalName: string;
  mimeType: string;
  type: MediaType;
  size: number;
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  title: string | null;  // Tiêu đề ảnh
  altText: string | null;
  caption: string | null;
  uploadedBy: Types.ObjectId | null;
  categoryId: Types.ObjectId | null;  // Danh mục ảnh
  usedIn: MediaUsage[] | null;
  assignments: MediaAssignment[];  // Gán vào page/section
  folder: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true, maxlength: 255 },
    originalName: { type: String, required: true, maxlength: 500 },
    mimeType: { type: String, required: true, maxlength: 100 },
    type: { type: String, enum: ['image', 'video', 'document', 'audio', 'other'], default: 'other' },
    size: { type: Number, required: true },
    url: { type: String, required: true, maxlength: 1000 },
    thumbnailUrl: { type: String, default: null, maxlength: 1000 },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    title: { type: String, default: null, maxlength: 500 },
    altText: { type: String, default: null, maxlength: 500 },
    caption: { type: String, default: null },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    usedIn: [
      {
        entityType: String,
        entityId: String,
        field: String,
      },
    ],
    assignments: [
      {
        pageSlug: { type: String, required: true },
        sectionKey: { type: String, required: true },
        elementId: { type: String },
      },
    ],
    folder: { type: String, default: null, maxlength: 255 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
mediaSchema.index({ type: 1 });
mediaSchema.index({ folder: 1 });
mediaSchema.index({ categoryId: 1 });
mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ 'assignments.pageSlug': 1 });
mediaSchema.index({ 'assignments.sectionKey': 1 });

export const Media = mongoose.model<IMedia>('Media', mediaSchema);
