import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Dictionary Term Interface
 * Represents a glossary/dictionary entry for technical terms
 */
export interface IDictionaryTerm extends Document {
  _id: Types.ObjectId;
  term: string;           // The term/word being defined
  slug: string;           // URL-friendly slug
  definition: string;     // Short definition
  description?: string;   // Detailed explanation (supports HTML)
  pronunciation?: string; // IPA or phonetic pronunciation
  partOfSpeech?: string;  // noun, verb, adjective, etc.
  synonyms?: string[];    // Related terms with similar meaning
  antonyms?: string[];    // Opposite terms
  relatedTerms?: Types.ObjectId[]; // Links to other dictionary entries
  examples?: string[];    // Usage examples
  etymology?: string;     // Word origin/history
  categoryId?: Types.ObjectId; // Link to category for organization
  tags?: string[];        // Additional tags for filtering
  source?: string;        // Source/reference for the definition
  imageUrl?: string;      // Illustration image
  audioUrl?: string;      // Pronunciation audio file
  videoUrl?: string;      // Explanatory video
  isActive: boolean;      // Visibility status
  isFeatured: boolean;    // Featured on homepage
  viewCount: number;      // Number of views
  sortOrder: number;      // Manual sort order
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DictionaryTermSchema = new Schema<IDictionaryTerm>(
  {
    term: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    definition: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 50000,
    },
    pronunciation: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    partOfSpeech: {
      type: String,
      trim: true,
      enum: ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'abbreviation', 'acronym', 'other'],
    },
    synonyms: [{
      type: String,
      trim: true,
    }],
    antonyms: [{
      type: String,
      trim: true,
    }],
    relatedTerms: [{
      type: Schema.Types.ObjectId,
      ref: 'DictionaryTerm',
    }],
    examples: [{
      type: String,
      trim: true,
    }],
    etymology: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    source: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    audioUrl: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    seo: {
      metaTitle: { type: String, maxlength: 70 },
      metaDescription: { type: String, maxlength: 160 },
      keywords: [{ type: String }],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient querying
DictionaryTermSchema.index({ term: 'text', definition: 'text', description: 'text' });
DictionaryTermSchema.index({ slug: 1 });
DictionaryTermSchema.index({ categoryId: 1, isActive: 1 });
DictionaryTermSchema.index({ tags: 1 });
DictionaryTermSchema.index({ 'term': 1 }); // For alphabetical listing
DictionaryTermSchema.index({ viewCount: -1 }); // For popular terms
DictionaryTermSchema.index({ createdAt: -1 }); // For recent terms

// Virtual for category
DictionaryTermSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for related terms populated
DictionaryTermSchema.virtual('related', {
  ref: 'DictionaryTerm',
  localField: 'relatedTerms',
  foreignField: '_id',
});

// Pre-save hook to generate slug
DictionaryTermSchema.pre('save', function (next) {
  if (this.isModified('term') && !this.slug) {
    this.slug = this.term
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export const DictionaryTerm = mongoose.model<IDictionaryTerm>('DictionaryTerm', DictionaryTermSchema);
