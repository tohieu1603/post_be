import mongoose, { Schema, Document, Types } from 'mongoose';

export type IndexStatusType = 'pending' | 'submitted' | 'indexed' | 'not_indexed' | 'error' | 'removed';
export type UrlType = 'post' | 'category' | 'tag' | 'page' | 'other';
export type SubmissionMethod = 'indexing_api' | 'sitemap' | 'manual' | 'url_inspection';

export interface IIndexStatus extends Document {
  _id: Types.ObjectId;
  url: string;
  status: IndexStatusType;
  postId: Types.ObjectId | null;
  urlType: UrlType;
  submittedAt: Date | null;
  submissionMethod: SubmissionMethod | null;
  indexedAt: Date | null;
  lastCrawledAt: Date | null;
  crawlStatus: string | null;
  indexingStatus: string | null;
  errorMessage: string | null;
  retryCount: number;
  isMobileFriendly: boolean | null;
  mobileScore: number | null;
  desktopScore: number | null;
  lastChecked: Date | null;
  lastCheckedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const indexStatusSchema = new Schema<IIndexStatus>(
  {
    url: { type: String, required: true, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'indexed', 'not_indexed', 'error', 'removed'],
      default: 'pending',
    },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
    urlType: {
      type: String,
      enum: ['post', 'category', 'tag', 'page', 'other'],
      default: 'post',
    },
    submittedAt: { type: Date, default: null },
    submissionMethod: {
      type: String,
      enum: ['indexing_api', 'sitemap', 'manual', 'url_inspection'],
      default: null,
    },
    indexedAt: { type: Date, default: null },
    lastCrawledAt: { type: Date, default: null },
    crawlStatus: { type: String, default: null, maxlength: 100 },
    indexingStatus: { type: String, default: null, maxlength: 100 },
    errorMessage: { type: String, default: null },
    retryCount: { type: Number, default: 0 },
    isMobileFriendly: { type: Boolean, default: null },
    mobileScore: { type: Number, default: null },
    desktopScore: { type: Number, default: null },
    lastChecked: { type: Date, default: null },
    lastCheckedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for post
indexStatusSchema.virtual('post', {
  ref: 'Post',
  localField: 'postId',
  foreignField: '_id',
  justOne: true,
});

// Indexes
indexStatusSchema.index({ url: 1 });
indexStatusSchema.index({ status: 1 });
indexStatusSchema.index({ postId: 1 });
indexStatusSchema.index({ urlType: 1 });

export const IndexStatus = mongoose.model<IIndexStatus>('IndexStatus', indexStatusSchema);
