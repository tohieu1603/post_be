import { ActivityLog, IActivityLog, ActivityAction, EntityType, ActivityChange } from '../models/activity-log.model';
import { Types, Document } from 'mongoose';

// Plain object type without Mongoose Document methods
type ActivityLogDoc = Omit<IActivityLog, keyof Document> & { _id: Types.ObjectId };

/**
 * Activity Log Repository - MongoDB/Mongoose implementation
 */
export class ActivityLogRepository {
  /**
   * Find logs by user
   */
  async findByUser(userId: string, limit = 50): Promise<ActivityLogDoc[]> {
    if (!Types.ObjectId.isValid(userId)) return [];
    return ActivityLog.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<ActivityLogDoc[]>();
  }

  /**
   * Find logs by entity
   */
  async findByEntity(entityType: EntityType, entityId: string): Promise<ActivityLogDoc[]> {
    if (!Types.ObjectId.isValid(entityId)) return [];
    return ActivityLog.find({
      entityType,
      entityId: new Types.ObjectId(entityId),
    })
      .sort({ createdAt: -1 })
      .lean<ActivityLogDoc[]>();
  }

  /**
   * Find recent logs
   */
  async findRecent(limit = 100): Promise<ActivityLogDoc[]> {
    return ActivityLog.find()
      .populate('user')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<ActivityLogDoc[]>();
  }

  /**
   * Log activity
   */
  async logActivity(data: {
    userId?: string;
    action: ActivityAction;
    entityType: EntityType;
    entityId?: string;
    entityName?: string;
    metadata?: Record<string, unknown>;
    changes?: ActivityChange[];
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ActivityLogDoc> {
    const log = new ActivityLog({
      userId: data.userId && Types.ObjectId.isValid(data.userId)
        ? new Types.ObjectId(data.userId)
        : null,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId && Types.ObjectId.isValid(data.entityId)
        ? new Types.ObjectId(data.entityId)
        : null,
      entityName: data.entityName || null,
      metadata: data.metadata || null,
      changes: data.changes || null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
    });
    const saved = await log.save();
    return saved.toObject() as ActivityLogDoc;
  }

  /**
   * Create log
   */
  async create(data: Partial<IActivityLog>): Promise<ActivityLogDoc> {
    const log = new ActivityLog(data);
    const saved = await log.save();
    return saved.toObject() as ActivityLogDoc;
  }

  /**
   * Find all logs
   */
  async find(): Promise<ActivityLogDoc[]> {
    return ActivityLog.find().sort({ createdAt: -1 }).lean<ActivityLogDoc[]>();
  }

  /**
   * Save log
   */
  async save(log: Partial<IActivityLog>): Promise<ActivityLogDoc> {
    if (log._id) {
      const doc = await ActivityLog.findByIdAndUpdate(log._id, log, { new: true, upsert: true });
      return doc?.toObject() as ActivityLogDoc;
    }
    return this.create(log);
  }
}

// Singleton instance
export const activityLogRepository = new ActivityLogRepository();
