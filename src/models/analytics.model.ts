import mongoose, { Schema, Document, Types } from 'mongoose';

export type AnalyticsEventType =
  | 'page_view'
  | 'post_view'
  | 'category_view'
  | 'faq_click'
  | 'toc_click'
  | 'search'
  | 'link_click'
  | 'share_facebook'
  | 'share_twitter'
  | 'share_copy_link'
  | 'tag_click'
  | 'related_post_click'
  | 'category_link_click';

export type AnalyticsEntityType = 'post' | 'category' | 'page' | 'faq' | 'link' | 'toc' | 'tag';

export interface IAnalyticsEvent extends Document {
  _id: Types.ObjectId;
  eventType: AnalyticsEventType;
  entityType: AnalyticsEntityType;
  entityId: Types.ObjectId | null;
  entitySlug: string | null;
  // Visitor tracking
  sessionId: string;
  ipAddress: string | null;
  userAgent: string | null;
  referrer: string | null;
  // Time tracking
  date: Date; // Date only (for daily aggregation)
  createdAt: Date;
  // Additional metadata
  metadata: Record<string, unknown> | null;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    eventType: {
      type: String,
      enum: [
        'page_view', 'post_view', 'category_view', 'faq_click', 'toc_click',
        'search', 'link_click', 'share_facebook', 'share_twitter', 'share_copy_link',
        'tag_click', 'related_post_click', 'category_link_click'
      ],
      required: true,
    },
    entityType: {
      type: String,
      enum: ['post', 'category', 'page', 'faq', 'link', 'toc', 'tag'],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, default: null },
    entitySlug: { type: String, default: null, maxlength: 255 },
    sessionId: { type: String, required: true, maxlength: 64 },
    ipAddress: { type: String, default: null, maxlength: 45 },
    userAgent: { type: String, default: null, maxlength: 500 },
    referrer: { type: String, default: null, maxlength: 1000 },
    date: { type: Date, required: true },
    metadata: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
analyticsEventSchema.index({ eventType: 1, date: -1 });
analyticsEventSchema.index({ entityType: 1, entityId: 1, date: -1 });
analyticsEventSchema.index({ entitySlug: 1, date: -1 });
analyticsEventSchema.index({ sessionId: 1, entityId: 1, date: 1 }); // For deduplication
analyticsEventSchema.index({ date: -1 });
analyticsEventSchema.index({ createdAt: -1 });

// Daily aggregation model for faster dashboard queries
export interface IDailyStats extends Document {
  _id: Types.ObjectId;
  date: Date;
  entityType: 'post' | 'category' | 'page';
  entityId: Types.ObjectId | null;
  entitySlug: string | null;
  totalViews: number;
  uniqueViews: number; // Unique sessions
  createdAt: Date;
  updatedAt: Date;
}

const dailyStatsSchema = new Schema<IDailyStats>(
  {
    date: { type: Date, required: true },
    entityType: {
      type: String,
      enum: ['post', 'category', 'page'],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, default: null },
    entitySlug: { type: String, default: null, maxlength: 255 },
    totalViews: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Unique compound index for daily stats
dailyStatsSchema.index({ date: 1, entityType: 1, entityId: 1 }, { unique: true });
dailyStatsSchema.index({ entityType: 1, entityId: 1, date: -1 });
dailyStatsSchema.index({ date: -1 });

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema);
export const DailyStats = mongoose.model<IDailyStats>('DailyStats', dailyStatsSchema);
