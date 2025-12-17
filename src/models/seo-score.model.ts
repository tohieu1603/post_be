import mongoose, { Schema, Document, Types } from 'mongoose';

export interface SeoAnalysis {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  headings: { h1: number; h2: number; h3: number; h4: number };
  images: { total: number; withAlt: number; withoutAlt: number };
  links: { internal: number; external: number };
  keywordDensity: number;
  focusKeyword?: string;
  focusKeywordCount?: number;
}

export interface SeoSuggestion {
  type: 'error' | 'warning' | 'success' | 'info';
  category: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AiSuggestions {
  suggestedTitle?: string;
  suggestedMetaDescription?: string;
  suggestedKeywords?: string[];
  contentImprovements?: string[];
  internalLinkSuggestions?: Array<{ postId: string; title: string; anchor: string }>;
  faqSuggestions?: Array<{ question: string; answer: string }>;
}

export interface ISeoScore extends Document {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  overallScore: number;
  titleScore: number;
  metaDescriptionScore: number;
  contentScore: number;
  headingScore: number;
  keywordScore: number;
  readabilityScore: number;
  internalLinkScore: number;
  imageScore: number;
  technicalScore: number;
  analysis: SeoAnalysis | null;
  suggestions: SeoSuggestion[] | null;
  aiSuggestions: AiSuggestions | null;
  checkedAt: Date;
}

const seoScoreSchema = new Schema<ISeoScore>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    overallScore: { type: Number, default: 0 },
    titleScore: { type: Number, default: 0 },
    metaDescriptionScore: { type: Number, default: 0 },
    contentScore: { type: Number, default: 0 },
    headingScore: { type: Number, default: 0 },
    keywordScore: { type: Number, default: 0 },
    readabilityScore: { type: Number, default: 0 },
    internalLinkScore: { type: Number, default: 0 },
    imageScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    analysis: { type: Schema.Types.Mixed, default: null },
    suggestions: [
      {
        type: { type: String, enum: ['error', 'warning', 'success', 'info'] },
        category: String,
        message: String,
        priority: { type: String, enum: ['high', 'medium', 'low'] },
      },
    ],
    aiSuggestions: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: 'checkedAt', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for post
seoScoreSchema.virtual('post', {
  ref: 'Post',
  localField: 'postId',
  foreignField: '_id',
  justOne: true,
});

// Indexes
seoScoreSchema.index({ postId: 1 });
seoScoreSchema.index({ overallScore: -1 });
seoScoreSchema.index({ checkedAt: -1 });

export const SeoScore = mongoose.model<ISeoScore>('SeoScore', seoScoreSchema);
