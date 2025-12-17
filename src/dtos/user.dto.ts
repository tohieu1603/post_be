import { UserRole } from '../models/user.model';

export { UserRole };

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  avatar?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
