import mongoose, { Schema, Document, Types } from 'mongoose';

export type RedirectStatus = 301 | 302 | 307 | 308;

export interface IRedirect extends Document {
  _id: Types.ObjectId;
  fromPath: string;
  toPath: string;
  statusCode: RedirectStatus;
  isActive: boolean;
  hitCount: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const redirectSchema = new Schema<IRedirect>(
  {
    fromPath: { type: String, required: true, unique: true, maxlength: 1000 },
    toPath: { type: String, required: true, maxlength: 1000 },
    statusCode: { type: Number, enum: [301, 302, 307, 308], default: 301 },
    isActive: { type: Boolean, default: true },
    hitCount: { type: Number, default: 0 },
    note: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// Indexes (fromPath already indexed via unique: true)
redirectSchema.index({ isActive: 1 });

export const Redirect = mongoose.model<IRedirect>('Redirect', redirectSchema);
