import mongoose, { Schema, Document, Types } from 'mongoose';

export type SettingsCategory = 'site' | 'seo' | 'email' | 'api' | 'general';

export interface ISettings extends Document {
  _id: Types.ObjectId;
  key: string;
  value: unknown;
  category: SettingsCategory;
  label: string | null;
  description: string | null;
  isSecret: boolean;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, maxlength: 100 },
    value: { type: Schema.Types.Mixed, required: true },
    category: { type: String, enum: ['site', 'seo', 'email', 'api', 'general'], default: 'general' },
    label: { type: String, default: null, maxlength: 255 },
    description: { type: String, default: null },
    isSecret: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

// Indexes (key already indexed via unique: true)
settingsSchema.index({ category: 1 });

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
