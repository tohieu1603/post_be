import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Author Model - E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 * Supports Google's quality guidelines for content authors
 * Enhanced with CV-like dynamic content fields
 */

// === CV-like Dynamic Content Types ===

export interface ExperienceItem {
  id: string;
  company: string;           // Tên công ty/tổ chức
  position: string;          // Chức vụ
  startDate: string;         // Ngày bắt đầu (YYYY-MM hoặc YYYY)
  endDate?: string;          // Ngày kết thúc (null = hiện tại)
  isCurrent?: boolean;       // Đang làm việc
  description?: string;      // Mô tả công việc
  location?: string;         // Địa điểm
}

export interface EducationItem {
  id: string;
  school: string;            // Tên trường/tổ chức
  degree: string;            // Bằng cấp
  field?: string;            // Chuyên ngành
  startYear?: number;        // Năm bắt đầu
  endYear?: number;          // Năm tốt nghiệp
  description?: string;      // Mô tả thêm
}

export interface CertificationItem {
  id: string;
  name: string;              // Tên chứng chỉ
  issuer: string;            // Tổ chức cấp
  issueDate?: string;        // Ngày cấp
  expiryDate?: string;       // Ngày hết hạn (null = không hết hạn)
  credentialId?: string;     // Mã chứng chỉ
  credentialUrl?: string;    // Link verify
}

export interface AchievementItem {
  id: string;
  title: string;             // Tên thành tựu/giải thưởng
  issuer?: string;           // Tổ chức trao
  date?: string;             // Ngày đạt được
  description?: string;      // Mô tả
}

export interface SkillItem {
  id: string;
  name: string;              // Tên kỹ năng
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface PublicationItem {
  id: string;
  title: string;             // Tên bài báo/sách/nghiên cứu
  publisher?: string;        // Nhà xuất bản/tạp chí
  date?: string;             // Ngày xuất bản
  url?: string;              // Link
  description?: string;      // Mô tả ngắn
}

export interface IAuthor extends Document {
  _id: Types.ObjectId;
  // Basic info
  name: string;
  slug: string;
  email: string | null;
  avatarUrl: string | null;

  // E-E-A-T signals
  bio: string | null;                    // Expertise description
  shortBio: string | null;               // Bio ngắn (cho card, preview)
  jobTitle: string | null;               // Chức danh hiện tại
  company: string | null;                // Công ty/tổ chức hiện tại
  location: string | null;               // Địa điểm

  // Dynamic CV-like content
  expertise: string[];                   // Danh sách chuyên môn (tags)
  experience: ExperienceItem[];          // Kinh nghiệm làm việc
  education: EducationItem[];            // Học vấn
  certifications: CertificationItem[];   // Chứng chỉ
  achievements: AchievementItem[];       // Thành tựu/giải thưởng
  skills: SkillItem[];                   // Kỹ năng
  publications: PublicationItem[];       // Bài báo/nghiên cứu

  // Legacy fields (kept for compatibility)
  credentials: string | null;            // Bằng cấp, chứng chỉ (text)
  yearsExperience: number | null;        // Số năm kinh nghiệm (computed from experience)

  // Social proof - Schema.org sameAs
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  facebook: string | null;
  github: string | null;
  youtube: string | null;
  sameAs: string[];                      // Array of social/profile URLs

  // Relation to User (if author is also a system user)
  userId: Types.ObjectId | null;

  // SEO
  metaTitle: string | null;
  metaDescription: string | null;

  isActive: boolean;
  isFeatured: boolean;                   // Tác giả nổi bật
  sortOrder: number;                     // Thứ tự hiển thị
  createdAt: Date;
  updatedAt: Date;
}

const authorSchema = new Schema<IAuthor>(
  {
    // Basic info
    name: { type: String, required: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, maxlength: 200 },
    email: { type: String, default: null, maxlength: 255 },
    avatarUrl: { type: String, default: null, maxlength: 1000 },

    // E-E-A-T signals
    bio: { type: String, default: null },
    shortBio: { type: String, default: null, maxlength: 500 },
    jobTitle: { type: String, default: null, maxlength: 200 },
    company: { type: String, default: null, maxlength: 200 },
    location: { type: String, default: null, maxlength: 200 },

    // Dynamic CV-like content
    expertise: [{ type: String }],
    experience: [{
      id: { type: String, required: true },
      company: { type: String, required: true },
      position: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, default: null },
      isCurrent: { type: Boolean, default: false },
      description: { type: String, default: null },
      location: { type: String, default: null },
    }],
    education: [{
      id: { type: String, required: true },
      school: { type: String, required: true },
      degree: { type: String, required: true },
      field: { type: String, default: null },
      startYear: { type: Number, default: null },
      endYear: { type: Number, default: null },
      description: { type: String, default: null },
    }],
    certifications: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      issueDate: { type: String, default: null },
      expiryDate: { type: String, default: null },
      credentialId: { type: String, default: null },
      credentialUrl: { type: String, default: null },
    }],
    achievements: [{
      id: { type: String, required: true },
      title: { type: String, required: true },
      issuer: { type: String, default: null },
      date: { type: String, default: null },
      description: { type: String, default: null },
    }],
    skills: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: null },
      yearsOfExperience: { type: Number, default: null },
    }],
    publications: [{
      id: { type: String, required: true },
      title: { type: String, required: true },
      publisher: { type: String, default: null },
      date: { type: String, default: null },
      url: { type: String, default: null },
      description: { type: String, default: null },
    }],

    // Legacy fields
    credentials: { type: String, default: null, maxlength: 500 },
    yearsExperience: { type: Number, default: null },

    // Social proof
    website: { type: String, default: null, maxlength: 500 },
    twitter: { type: String, default: null, maxlength: 200 },
    linkedin: { type: String, default: null, maxlength: 500 },
    facebook: { type: String, default: null, maxlength: 500 },
    github: { type: String, default: null, maxlength: 200 },
    youtube: { type: String, default: null, maxlength: 500 },
    sameAs: [{ type: String }],

    // Relation
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    // SEO
    metaTitle: { type: String, default: null, maxlength: 255 },
    metaDescription: { type: String, default: null, maxlength: 500 },

    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
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
authorSchema.index({ isFeatured: 1 });
authorSchema.index({ sortOrder: 1 });
authorSchema.index({ name: 'text', bio: 'text', expertise: 'text' });

export const Author = mongoose.model<IAuthor>('Author', authorSchema);
