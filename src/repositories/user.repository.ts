import { User, IUser } from '../models/user.model';
import { Types, FilterQuery } from 'mongoose';

/**
 * User Repository - MongoDB/Mongoose implementation
 */
export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).lean({ virtuals: true }) as unknown as IUser | null;
  }

  /**
   * Find all users without password
   */
  async findAllWithoutPassword(): Promise<IUser[]> {
    return User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean({ virtuals: true }) as unknown as IUser[];
  }

  /**
   * Search users
   */
  async search(query: string): Promise<IUser[]> {
    return User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    })
      .select('-passwordHash')
      .sort({ name: 1 })
      .lean({ virtuals: true }) as unknown as IUser[];
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return User.findById(id).lean({ virtuals: true }) as unknown as IUser | null;
  }

  /**
   * Find user by ID without password
   */
  async findByIdWithoutPassword(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return User.findById(id).select('-passwordHash').lean({ virtuals: true }) as unknown as IUser | null;
  }

  /**
   * Create new user
   */
  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    const saved = await user.save();
    return saved.toObject();
  }

  /**
   * Update user
   */
  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return User.findByIdAndUpdate(id, data, { new: true })
      .select('-passwordHash')
      .lean({ virtuals: true }) as unknown as IUser | null;
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Count users
   */
  async count(query?: FilterQuery<IUser>): Promise<number> {
    return User.countDocuments(query || {});
  }

  /**
   * Update last login
   */
  async updateLastLogin(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await User.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }

  /**
   * Find one by query
   */
  async findOne(query: FilterQuery<IUser>): Promise<IUser | null> {
    return User.findOne(query).lean({ virtuals: true }) as unknown as IUser | null;
  }

  /**
   * Save user (for existing documents)
   */
  async save(user: IUser): Promise<IUser> {
    const doc = await User.findByIdAndUpdate(user._id, user, { new: true });
    return doc?.toObject() || user;
  }
}

// Singleton instance
export const userRepository = new UserRepository();
