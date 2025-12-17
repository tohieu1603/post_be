/**
 * Authentication Service
 * Handles user authentication, registration, and password management
 */

import bcrypt from 'bcryptjs';
import { User, IUser, UserRole } from '../models/user.model';
import { generateAccessToken, generateRefreshToken, verifyToken, JwtPayload } from '../config/jwt';

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check if email already exists
    const existing = await User.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw new Error('Email already registered');
    }

    // Validate password
    if (dto.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Create user
    const user = new User({
      email: dto.email.toLowerCase(),
      passwordHash,
      name: dto.name,
      role: dto.role || 'viewer', // Default role
      isActive: true,
    });

    await user.save();

    // Generate tokens
    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    // Find user by email
    const user = await User.findOne({ email: dto.email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = verifyToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid or expired refresh token');
    }

    // Verify user still exists and is active
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or deactivated');
    }

    // Generate new tokens
    const newPayload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: generateAccessToken(newPayload),
      refreshToken: generateRefreshToken(newPayload),
    };
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string): Promise<Omit<IUser, 'passwordHash'> | null> {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return null;
    return user.toObject() as Omit<IUser, 'passwordHash'>;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: { name?: string; avatar?: string }): Promise<Omit<IUser, 'passwordHash'>> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (data.name) user.name = data.name;
    if (data.avatar !== undefined) user.avatar = data.avatar;

    await user.save();

    const { passwordHash, ...profile } = user.toObject();
    return profile as unknown as Omit<IUser, 'passwordHash'>;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();
  }

  /**
   * Create admin user if none exists (for initial setup)
   */
  async createInitialAdmin(): Promise<boolean> {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return false; // Admin already exists
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    const admin = new User({
      email: 'admin@managepost.local',
      passwordHash,
      name: 'Admin',
      role: 'admin',
      isActive: true,
    });

    await admin.save();
    console.log('[Auth] Initial admin created: admin@managepost.local / admin123');
    return true;
  }
}

// Singleton instance
export const authService = new AuthService();
