import mongoose, { Schema, Document, Types } from 'mongoose';

export type SeoLogAction =
  | 'submit_index'
  | 'check_index'
  | 'update_meta'
  | 'generate_sitemap'
  | 'check_ranking'
  | 'ai_analyze'
  | 'seo_analyze'
  | 'pagespeed_check'
  | 'redirect_create'
  | 'redirect_update'
  | 'robots_update'
  | 'schema_generate'
  | 'content_optimize'
  | 'keyword_track'
  | 'audit_run'
  | 'scheduled_task'
  | 'broken_link_check'
  | 'content_freshness'
  | 'report_generated';

export type SeoLogEntityType = 'post' | 'category' | 'tag' | 'page' | 'site' | 'keyword';
export type SeoLogStatus = 'success' | 'failed' | 'pending' | 'skipped' | 'warning' | 'info';

export interface ISeoLog extends Document {
  _id: Types.ObjectId;
  action: SeoLogAction;
  entityType: SeoLogEntityType | null;
  entityId: Types.ObjectId | null;
  entityUrl: string | null;
  status: SeoLogStatus;
  message: string | null;
  details: Record<string, unknown> | null;
  apiResponse: Record<string, unknown> | null;
  duration: number | null;
  userId: Types.ObjectId | null;
  isScheduled: boolean;
  createdAt: Date;
}

const seoLogSchema = new Schema<ISeoLog>(
  {
    action: {
      type: String,
      enum: [
        'submit_index', 'check_index', 'update_meta', 'generate_sitemap',
        'check_ranking', 'ai_analyze', 'seo_analyze', 'pagespeed_check',
        'redirect_create', 'redirect_update', 'robots_update', 'schema_generate',
        'content_optimize', 'keyword_track', 'audit_run', 'scheduled_task',
        'broken_link_check', 'content_freshness', 'report_generated'
      ],
      required: true,
    },
    entityType: {
      type: String,
      enum: ['post', 'category', 'tag', 'page', 'site', 'keyword'],
      default: null,
    },
    entityId: { type: Schema.Types.ObjectId, default: null },
    entityUrl: { type: String, default: null, maxlength: 500 },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending', 'skipped', 'warning', 'info'],
      default: 'pending',
    },
    message: { type: String, default: null },
    details: { type: Schema.Types.Mixed, default: null },
    apiResponse: { type: Schema.Types.Mixed, default: null },
    duration: { type: Number, default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    isScheduled: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user
seoLogSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Indexes
seoLogSchema.index({ action: 1 });
seoLogSchema.index({ status: 1 });
seoLogSchema.index({ entityType: 1 });
seoLogSchema.index({ createdAt: -1 });
seoLogSchema.index({ isScheduled: 1 });

export const SeoLog = mongoose.model<ISeoLog>('SeoLog', seoLogSchema);
