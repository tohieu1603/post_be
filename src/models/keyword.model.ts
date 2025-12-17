import mongoose, { Schema, Document, Types } from 'mongoose';

export interface RankingHistoryEntry {
  date: string;
  position: number;
  clicks: number;
  impressions: number;
}

export interface IKeyword extends Document {
  _id: Types.ObjectId;
  keyword: string;
  language: string | null;
  country: string | null;
  searchVolume: number | null;
  difficulty: number | null;
  currentRank: number | null;
  previousRank: number | null;
  bestRank: number | null;
  currentPosition: number | null;
  previousPosition: number | null;
  positionChange: number;
  targetUrl: string | null;
  postId: Types.ObjectId | null;
  clicks: number;
  impressions: number;
  ctr: number;
  isTracking: boolean;
  lastChecked: Date | null;
  lastCheckedAt: Date | null;
  rankingHistory: RankingHistoryEntry[] | null;
  createdAt: Date;
  updatedAt: Date;
}

const keywordSchema = new Schema<IKeyword>(
  {
    keyword: { type: String, required: true, maxlength: 255 },
    language: { type: String, default: null, maxlength: 100 },
    country: { type: String, default: null, maxlength: 100 },
    searchVolume: { type: Number, default: null },
    difficulty: { type: Number, default: null },
    currentRank: { type: Number, default: null },
    previousRank: { type: Number, default: null },
    bestRank: { type: Number, default: null },
    currentPosition: { type: Number, default: null },
    previousPosition: { type: Number, default: null },
    positionChange: { type: Number, default: 0 },
    targetUrl: { type: String, default: null, maxlength: 500 },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    isTracking: { type: Boolean, default: true },
    lastChecked: { type: Date, default: null },
    lastCheckedAt: { type: Date, default: null },
    rankingHistory: [
      {
        date: String,
        position: Number,
        clicks: Number,
        impressions: Number,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for post
keywordSchema.virtual('post', {
  ref: 'Post',
  localField: 'postId',
  foreignField: '_id',
  justOne: true,
});

// Indexes
keywordSchema.index({ keyword: 1 });
keywordSchema.index({ postId: 1 });
keywordSchema.index({ isTracking: 1 });
keywordSchema.index({ currentPosition: 1 });

export const Keyword = mongoose.model<IKeyword>('Keyword', keywordSchema);
