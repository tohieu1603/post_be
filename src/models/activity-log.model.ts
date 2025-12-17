import mongoose, { Schema, Document, Types } from 'mongoose';

export type ActivityAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'unpublish'
  | 'login'
  | 'logout'
  | 'upload'
  | 'view';

export type EntityType =
  | 'post'
  | 'category'
  | 'tag'
  | 'media'
  | 'user'
  | 'settings'
  | 'redirect';

export interface ActivityChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface IActivityLog extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId | null;
  action: ActivityAction;
  entityType: EntityType;
  entityId: Types.ObjectId | null;
  entityName: string | null;
  metadata: Record<string, unknown> | null;
  changes: ActivityChange[] | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'publish', 'unpublish', 'login', 'logout', 'upload', 'view'],
      required: true,
    },
    entityType: {
      type: String,
      enum: ['post', 'category', 'tag', 'media', 'user', 'settings', 'redirect'],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, default: null },
    entityName: { type: String, default: null, maxlength: 500 },
    metadata: { type: Schema.Types.Mixed, default: null },
    changes: [
      {
        field: String,
        oldValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed,
      },
    ],
    ipAddress: { type: String, default: null, maxlength: 45 },
    userAgent: { type: String, default: null, maxlength: 500 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user
activityLogSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Indexes
activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ entityType: 1 });
activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
