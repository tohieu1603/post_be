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
  synonym?: string;       // Single synonym/alias for the term
  relatedTerms?: string[]; // Related term names as strings
  examples?: string[];    // Usage examples
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
    synonym: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    relatedTerms: [{
      type: String,
      trim: true,
    }],
    examples: [{
      type: String,
      trim: true,
    }],
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
