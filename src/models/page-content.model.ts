import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * PageContent Model - Lưu trữ nội dung trang theo slug
 * Content là raw JSON object từ file page-content.json
 */

export interface IPageContent extends Document {
  _id: Types.ObjectId;
  pageSlug: string; // e.g., "thiet-ke-website-doanh-nghiep"
  pageName: string; // e.g., "Thiết kế website doanh nghiệp"
  content: Record<string, unknown>; // Raw JSON content từ file
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pageContentSchema = new Schema<IPageContent>(
  {
    pageSlug: {
      type: String,
      required: true,
      unique: true,
      maxlength: 255,
      lowercase: true,
      trim: true
    },
    pageName: {
      type: String,
      required: true,
      maxlength: 255,
      trim: true
    },
    content: {
      type: Schema.Types.Mixed,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  }
);

// Index for active pages
pageContentSchema.index({ isActive: 1 });

export const PageContent = mongoose.model<IPageContent>('PageContent', pageContentSchema);
