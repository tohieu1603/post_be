import { Redirect, IRedirect } from '../models/redirect.model';
import { Types, FilterQuery } from 'mongoose';

/**
 * Redirect Repository - MongoDB/Mongoose implementation
 */
export class RedirectRepository {
  /**
   * Find redirect by fromPath
   */
  async findByFromPath(fromPath: string): Promise<IRedirect | null> {
    return Redirect.findOne({ fromPath });
  }

  /**
   * Find all active redirects
   */
  async findActive(): Promise<IRedirect[]> {
    return Redirect.find({ isActive: true }).sort({ fromPath: 1 });
  }

  /**
   * Find all redirects
   */
  async findAll(): Promise<IRedirect[]> {
    return Redirect.find().sort({ fromPath: 1 });
  }

  /**
   * Increment hit count
   */
  async incrementHitCount(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await Redirect.findByIdAndUpdate(id, { $inc: { hitCount: 1 } });
  }

  /**
   * Find redirect by ID
   */
  async findById(id: string): Promise<IRedirect | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Redirect.findById(id);
  }

  /**
   * Find all redirects
   */
  async find(query?: FilterQuery<IRedirect>): Promise<IRedirect[]> {
    return Redirect.find(query || {}).sort({ fromPath: 1 });
  }

  /**
   * Create redirect
   */
  async create(data: Partial<IRedirect>): Promise<IRedirect> {
    const redirect = new Redirect(data);
    const saved = await redirect.save();
    return saved.toObject();
  }

  /**
   * Update redirect
   */
  async update(id: string, data: Partial<IRedirect>): Promise<IRedirect | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Redirect.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Delete redirect
   */
  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await Redirect.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Save redirect
   */
  async save(redirect: IRedirect): Promise<IRedirect> {
    const doc = await Redirect.findByIdAndUpdate(redirect._id, redirect, { new: true, upsert: true });
    return doc?.toObject() || redirect;
  }
}

// Singleton instance
export const redirectRepository = new RedirectRepository();
