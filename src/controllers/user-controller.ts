import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { successResponse, errorResponse } from '../utils/response.util';

const userService = new UserService();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let users;
    if (search && typeof search === 'string') {
      users = await userService.search(search);
    } else {
      users = await userService.findAll();
    }
    res.json(users);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users';
    errorResponse(res, message, 500);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user';
    errorResponse(res, message, 500);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create user';
    errorResponse(res, message, 500);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user';
    errorResponse(res, message, 500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.delete(req.params.id);
    successResponse(res, { message: 'User deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete user';
    errorResponse(res, message, 500);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: 'role is required' });
    }
    const user = await userService.updateRole(req.params.id, role);
    res.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user role';
    errorResponse(res, message, 500);
  }
};

export const toggleUserActive = async (req: Request, res: Response) => {
  try {
    const user = await userService.toggleActive(req.params.id);
    res.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to toggle user status';
    errorResponse(res, message, 500);
  }
};

export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const activity = await userService.getActivityLog(
      req.params.id,
      limit ? parseInt(limit as string) : undefined
    );
    res.json(activity);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get user activity';
    errorResponse(res, message, 500);
  }
};
