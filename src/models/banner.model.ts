import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Banner Model - Quản lý banner hiển thị cho bài viết trending
 * Auto-assign banner cho Top 10 bài viết có viewCount cao nhất
 */

export type BannerPosition = 'hero' | 'sidebar' | 'category' | 'footer';
export type BannerStatus = 'active' | 'inactive';

export interface IBanner extends Document {
  _id: Types.ObjectId;
  // Liên kết bài viết & danh mục
  postId: Types.ObjectId;
  categoryId: Types.ObjectId | null;  // Danh mục của bài viết (để lọc theo category)
  // Thông tin hiển thị
  title: string;              // Tiêu đề banner (mặc định = post.title)
  subtitle: string | null;    // Phụ đề
  imageUrl: string;           // URL ảnh banner (mặc định = post.coverImage)
  linkUrl: string;            // URL khi click (mặc định = post.slug)
  // Vị trí & thứ tự
  position: BannerPosition;   // Vị trí hiển thị
  rank: number;               // Thứ hạng trong Top (1-10) trong category
  sortOrder: number;          // Thứ tự hiển thị tùy chỉnh
  // Trạng thái
  status: BannerStatus;
  isAutoAssigned: boolean;    // True nếu được gán tự động từ trending
  // Thống kê
  viewCount: number;          // Số lượt hiển thị banner
  clickCount: number;         // Số lượt click
  // Thời gian
  startDate: Date | null;     // Ngày bắt đầu hiển thị (null = ngay lập tức)
  endDate: Date | null;       // Ngày kết thúc (null = vô thời hạn)
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    // Liên kết bài viết & danh mục
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    // Thông tin hiển thị
    title: { type: String, required: true, maxlength: 200 },
    subtitle: { type: String, default: null, maxlength: 300 },
    imageUrl: { type: String, required: true, maxlength: 1000 },
    linkUrl: { type: String, required: true, maxlength: 500 },
    // Vị trí & thứ tự
    position: {
      type: String,
      enum: ['hero', 'sidebar', 'category', 'footer'],
      default: 'hero',
    },
    rank: { type: Number, default: 0, min: 0, max: 10 },
    sortOrder: { type: Number, default: 0 },
    // Trạng thái
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isAutoAssigned: { type: Boolean, default: true },
    // Thống kê
    viewCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    // Thời gian
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for post
bannerSchema.virtual('post', {
  ref: 'Post',
  localField: 'postId',
  foreignField: '_id',
  justOne: true,
});

// Indexes
bannerSchema.index({ postId: 1 }, { unique: true }); // Mỗi post chỉ có 1 banner
bannerSchema.index({ categoryId: 1, position: 1, status: 1, rank: 1 }); // Lọc theo category
bannerSchema.index({ position: 1, status: 1, rank: 1 });
bannerSchema.index({ status: 1, startDate: 1, endDate: 1 });
bannerSchema.index({ isAutoAssigned: 1 });

export const Banner = mongoose.model<IBanner>('Banner', bannerSchema);
