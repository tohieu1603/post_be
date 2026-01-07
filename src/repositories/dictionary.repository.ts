import { DictionaryTerm, IDictionaryTerm } from '../models/dictionary.model';
import { DictionaryFilterDto, AlphabetIndexDto } from '../dtos/dictionary.dto';
import { Types, FilterQuery, SortOrder } from 'mongoose';
import { escapeRegex } from '../utils/security.util';

/**
 * Helper to add id from _id for lean() results
 */
function addId<T extends { _id?: unknown }>(doc: T | null): (T & { id: string }) | null {
  if (!doc) return null;
  return { ...doc, id: String(doc._id) };
}

function addIdArray<T extends { _id?: unknown }>(docs: T[]): (T & { id: string })[] {
  return docs.map(doc => ({ ...doc, id: String(doc._id) }));
}

/**
 * Dictionary Repository - MongoDB/Mongoose implementation
 */
export class DictionaryRepository {
  /**
   * Find all terms with pagination and filters
   */
  async findAllWithFilters(
    filters: DictionaryFilterDto = {}
  ): Promise<{ data: IDictionaryTerm[]; total: number }> {
    const {
      search,
      letter,
      categoryId,
      tags,
      partOfSpeech,
      isActive,
      isFeatured,
      page = 1,
      limit = 20,
      sortBy = 'term',
      sortOrder = 'ASC',
    } = filters;

    const query: FilterQuery<IDictionaryTerm> = {};

    // Full-text search with escaped regex
    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { term: { $regex: safeSearch, $options: 'i' } },
        { definition: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    // Filter by first letter
    if (letter && letter.length === 1) {
      const safeLetter = escapeRegex(letter);
      query.term = { $regex: `^${safeLetter}`, $options: 'i' };
    }

    // Filter by category
    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      query.categoryId = new Types.ObjectId(categoryId);
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      query.tags = { $in: tags.map(t => t.toLowerCase()) };
    }

    // Filter by part of speech
    if (partOfSpeech) {
      query.partOfSpeech = partOfSpeech;
    }

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    // Filter by featured status
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured;
    }

    const total = await DictionaryTerm.countDocuments(query);

    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrder === 'ASC' ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const rawData = await DictionaryTerm.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true });

    const data = addIdArray(rawData) as unknown as IDictionaryTerm[];
    return { data, total };
  }

  /**
   * Find term by ID
   */
  async findById(id: string): Promise<IDictionaryTerm | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await DictionaryTerm.findById(id)
      .populate('category', 'name slug')
      .populate('relatedTerms', 'term slug definition')
      .lean({ virtuals: true });
    return addId(doc) as IDictionaryTerm | null;
  }

  /**
   * Find term by slug
   */
  async findBySlug(slug: string): Promise<IDictionaryTerm | null> {
    const doc = await DictionaryTerm.findOne({ slug })
      .populate('category', 'name slug')
      .populate('relatedTerms', 'term slug definition')
      .lean({ virtuals: true });
    return addId(doc) as IDictionaryTerm | null;
  }

  /**
   * Find term by exact term name
   */
  async findByTerm(term: string): Promise<IDictionaryTerm | null> {
    const doc = await DictionaryTerm.findOne({ term: { $regex: `^${escapeRegex(term)}$`, $options: 'i' } })
      .lean({ virtuals: true });
    return addId(doc) as IDictionaryTerm | null;
  }

  /**
   * Create new term
   */
  async create(data: Partial<IDictionaryTerm>): Promise<IDictionaryTerm> {
    const term = new DictionaryTerm(data);
    await term.save();
    return term.toObject() as IDictionaryTerm;
  }

  /**
   * Update term
   */
  async update(id: string, data: Partial<IDictionaryTerm>): Promise<IDictionaryTerm | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await DictionaryTerm.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
      .populate('category', 'name slug')
      .lean({ virtuals: true });
    return addId(doc) as IDictionaryTerm | null;
  }

  /**
   * Delete term
   */
  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await DictionaryTerm.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await DictionaryTerm.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
  }

  /**
   * Get alphabet index (count of terms for each letter)
   */
  async getAlphabetIndex(isActive = true): Promise<AlphabetIndexDto[]> {
    const query: FilterQuery<IDictionaryTerm> = {};
    if (isActive) {
      query.isActive = true;
    }

    const result = await DictionaryTerm.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $toUpper: { $substr: ['$term', 0, 1] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return result.map(r => ({
      letter: r._id,
      count: r.count,
    }));
  }

  /**
   * Get featured terms
   */
  async getFeatured(limit = 10): Promise<IDictionaryTerm[]> {
    const docs = await DictionaryTerm.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .sort({ sortOrder: 1, term: 1 })
      .limit(limit)
      .lean({ virtuals: true });
    return addIdArray(docs) as unknown as IDictionaryTerm[];
  }

  /**
   * Get popular terms (most viewed)
   */
  async getPopular(limit = 10): Promise<IDictionaryTerm[]> {
    const docs = await DictionaryTerm.find({ isActive: true })
      .select('term slug definition viewCount')
      .sort({ viewCount: -1 })
      .limit(limit)
      .lean({ virtuals: true });
    return addIdArray(docs) as unknown as IDictionaryTerm[];
  }

  /**
   * Get recent terms
   */
  async getRecent(limit = 10): Promise<IDictionaryTerm[]> {
    const docs = await DictionaryTerm.find({ isActive: true })
      .select('term slug definition createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean({ virtuals: true });
    return addIdArray(docs) as unknown as IDictionaryTerm[];
  }

  /**
   * Get random terms
   */
  async getRandom(limit = 5): Promise<IDictionaryTerm[]> {
    const docs = await DictionaryTerm.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: limit } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
    ]);
    return addIdArray(docs) as unknown as IDictionaryTerm[];
  }

  /**
   * Get terms by category
   */
  async findByCategory(categoryId: string, limit = 50): Promise<IDictionaryTerm[]> {
    if (!Types.ObjectId.isValid(categoryId)) return [];
    const docs = await DictionaryTerm.find({
      categoryId: new Types.ObjectId(categoryId),
      isActive: true,
    })
      .select('term slug definition')
      .sort({ term: 1 })
      .limit(limit)
      .lean({ virtuals: true });
    return addIdArray(docs) as unknown as IDictionaryTerm[];
  }

  /**
   * Search suggestions (autocomplete)
   */
  async getSuggestions(query: string, limit = 10): Promise<{ term: string; slug: string }[]> {
    if (!query || query.length < 2) return [];
    const safeQuery = escapeRegex(query);
    const docs = await DictionaryTerm.find({
      isActive: true,
      term: { $regex: safeQuery, $options: 'i' },
    })
      .select('term slug')
      .sort({ term: 1 })
      .limit(limit)
      .lean();
    return docs.map(d => ({ term: d.term, slug: d.slug }));
  }

  /**
   * Count terms
   */
  async count(filters: FilterQuery<IDictionaryTerm> = {}): Promise<number> {
    return DictionaryTerm.countDocuments(filters);
  }

  /**
   * Get statistics by category
   */
  async getStatsByCategory(): Promise<Array<{ categoryId: string; categoryName: string; count: number }>> {
    const result = await DictionaryTerm.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$categoryId',
          categoryName: { $first: '$category.name' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return result.map(r => ({
      categoryId: r._id?.toString() || 'uncategorized',
      categoryName: r.categoryName || 'Uncategorized',
      count: r.count,
    }));
  }

  /**
   * Get statistics by part of speech
   */
  async getStatsByPartOfSpeech(): Promise<Array<{ partOfSpeech: string; count: number }>> {
    const result = await DictionaryTerm.aggregate([
      { $match: { isActive: true, partOfSpeech: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$partOfSpeech',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return result.map(r => ({
      partOfSpeech: r._id,
      count: r.count,
    }));
  }

  /**
   * Bulk import terms
   */
  async bulkImport(terms: Partial<IDictionaryTerm>[]): Promise<{ inserted: number; errors: string[] }> {
    const errors: string[] = [];
    let inserted = 0;

    for (const termData of terms) {
      try {
        await this.create(termData);
        inserted++;
      } catch (error: any) {
        errors.push(`Failed to import "${termData.term}": ${error.message}`);
      }
    }

    return { inserted, errors };
  }
}

// Singleton instance
export const dictionaryRepository = new DictionaryRepository();
