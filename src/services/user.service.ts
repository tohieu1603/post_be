import { User, IUser, UserRole } from '../models/user.model';
import { userRepository } from '../repositories/user.repository';
import { activityLogRepository } from '../repositories/activity-log.repository';
import { CreateUserDto, UpdateUserDto, UserResponse } from '../dtos/user.dto';
import bcrypt from 'bcryptjs';

// Use bcrypt for password hashing (consistent with auth.service)
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

function toUserResponse(user: IUser): UserResponse {
  return {
    id: user._id?.toString() || '',
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class UserService {
  async findAll(): Promise<UserResponse[]> {
    const users = await userRepository.findAllWithoutPassword();
    return users.map(toUserResponse);
  }

  async findById(id: string): Promise<UserResponse | null> {
    const user = await userRepository.findById(id);
    return user ? toUserResponse(user) : null;
  }

  async search(query: string): Promise<UserResponse[]> {
    const users = await userRepository.search(query);
    return users.map(toUserResponse);
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    // Check for duplicate email
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await userRepository.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      avatar: dto.avatar || undefined,
      role: dto.role || 'viewer',
      isActive: dto.isActive ?? true,
    });

    return toUserResponse(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await userRepository.findByEmail(dto.email);
      if (existing) {
        throw new Error('User with this email already exists');
      }
    }

    const updateData: Partial<IUser> = {
      email: dto.email ?? user.email,
      name: dto.name ?? user.name,
      avatar: dto.avatar !== undefined ? dto.avatar : user.avatar,
      role: dto.role ?? user.role,
      isActive: dto.isActive ?? user.isActive,
    };

    if (dto.password) {
      updateData.passwordHash = await hashPassword(dto.password);
    }

    const updated = await userRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update user');
    }

    return toUserResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const deleted = await userRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete user');
    }
  }

  async updateRole(id: string, role: UserRole): Promise<UserResponse> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updated = await userRepository.update(id, { role });
    if (!updated) {
      throw new Error('Failed to update user role');
    }

    return toUserResponse(updated);
  }

  async toggleActive(id: string): Promise<UserResponse> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updated = await userRepository.update(id, { isActive: !user.isActive });
    if (!updated) {
      throw new Error('Failed to toggle user status');
    }

    return toUserResponse(updated);
  }

  async getActivityLog(userId: string, limit = 50) {
    return activityLogRepository.findByUser(userId, limit);
  }
}
