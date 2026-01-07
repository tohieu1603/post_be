/**
 * RBAC (Role-Based Access Control) Utility
 * Defines roles, permissions, and access control functions
 */

/**
 * Available user roles (ordered by privilege level)
 */
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'writer' | 'viewer';

/**
 * Available permissions
 */
export type Permission =
  // Post permissions
  | 'post:view'
  | 'post:create_draft'
  | 'post:edit_own'
  | 'post:edit_any'
  | 'post:publish'
  | 'post:delete'
  // Category permissions
  | 'category:view'
  | 'category:manage'
  // Tag permissions
  | 'tag:view'
  | 'tag:manage'
  // Author permissions (E-E-A-T)
  | 'author:view'
  | 'author:manage'
  // Banner permissions
  | 'banner:view'
  | 'banner:create'
  | 'banner:edit'
  | 'banner:delete'
  | 'banner:sync'
  // Media permissions
  | 'media:view'
  | 'media:upload'
  | 'media:edit_own'
  | 'media:edit_any'
  | 'media:delete_own'
  | 'media:delete_any'
  // User permissions
  | 'user:view'
  | 'user:manage'
  // SEO permissions
  | 'seo:view'
  | 'seo:manage'
  // Settings permissions
  | 'settings:view'
  | 'settings:manage'
  // Analytics permissions
  | 'analytics:view';

/**
 * Role-Permission mapping based on requirements
 *
 * | Permission          | Super Admin | Admin | Editor | Writer | Viewer |
 * |---------------------|-------------|-------|--------|--------|--------|
 * | Xem bài viết        | ✓           | ✓     | ✓      | ✓      | ✓      |
 * | Tạo bài (Draft)     | ✓           | ✓     | ✓      | ✓      | ✗      |
 * | Sửa bài của mình    | ✓           | ✓     | ✓      | ✓      | ✗      |
 * | Sửa bài người khác  | ✓           | ✓     | ✓      | ✗      | ✗      |
 * | Publish/Unpublish   | ✓           | ✓     | ✓      | ✗      | ✗      |
 * | Xóa bài             | ✓           | ✓     | ✗      | ✗      | ✗      |
 * | Quản lý danh mục    | ✓           | ✓     | ✗      | ✗      | ✗      |
 * | Quản lý users       | ✓           | ✓     | ✗      | ✗      | ✗      |
 * | Cấu hình SEO        | ✓           | ✓     | ✗      | ✗      | ✗      |
 * | System settings     | ✓           | ✗     | ✗      | ✗      | ✗      |
 */
const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    // All permissions
    'post:view', 'post:create_draft', 'post:edit_own', 'post:edit_any', 'post:publish', 'post:delete',
    'category:view', 'category:manage',
    'tag:view', 'tag:manage',
    'author:view', 'author:manage',
    'banner:view', 'banner:create', 'banner:edit', 'banner:delete', 'banner:sync',
    'media:view', 'media:upload', 'media:edit_own', 'media:edit_any', 'media:delete_own', 'media:delete_any',
    'user:view', 'user:manage',
    'seo:view', 'seo:manage',
    'settings:view', 'settings:manage',
    'analytics:view',
  ],
  admin: [
    // All except system settings
    'post:view', 'post:create_draft', 'post:edit_own', 'post:edit_any', 'post:publish', 'post:delete',
    'category:view', 'category:manage',
    'tag:view', 'tag:manage',
    'author:view', 'author:manage',
    'banner:view', 'banner:create', 'banner:edit', 'banner:delete', 'banner:sync',
    'media:view', 'media:upload', 'media:edit_own', 'media:edit_any', 'media:delete_own', 'media:delete_any',
    'user:view', 'user:manage',
    'seo:view', 'seo:manage',
    'settings:view', // Can view but not manage system settings
    'analytics:view',
  ],
  editor: [
    // Post management (including others' posts), no delete, no category/user/seo management
    'post:view', 'post:create_draft', 'post:edit_own', 'post:edit_any', 'post:publish',
    'category:view',
    'tag:view', 'tag:manage',
    'author:view', // Can view authors but not manage
    'banner:view', // Can view banners but not manage
    'media:view', 'media:upload', 'media:edit_own', 'media:edit_any', 'media:delete_own',
    'user:view',
    'seo:view',
    'analytics:view',
  ],
  writer: [
    // Can create and edit own posts only, cannot publish
    'post:view', 'post:create_draft', 'post:edit_own',
    'category:view',
    'tag:view',
    'author:view', // Can view authors
    'banner:view', // Can view banners
    'media:view', 'media:upload', 'media:edit_own', 'media:delete_own',
    'user:view',
  ],
  viewer: [
    // Read-only access
    'post:view',
    'category:view',
    'tag:view',
    'author:view',
    'banner:view',
    'media:view',
  ],
};

/**
 * Role hierarchy (higher index = higher privilege)
 */
const roleHierarchy: UserRole[] = ['viewer', 'writer', 'editor', 'admin', 'super_admin'];

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = rolePermissions[role];
  return permissions?.includes(permission) ?? false;
}

/**
 * Check if a role has ALL of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] || [];
}

/**
 * Compare role privilege levels
 * Returns: positive if role1 > role2, negative if role1 < role2, 0 if equal
 */
export function compareRoles(role1: UserRole, role2: UserRole): number {
  const index1 = roleHierarchy.indexOf(role1);
  const index2 = roleHierarchy.indexOf(role2);
  return index1 - index2;
}

/**
 * Check if role1 has higher or equal privilege than role2
 */
export function isRoleHigherOrEqual(role1: UserRole, role2: UserRole): boolean {
  return compareRoles(role1, role2) >= 0;
}

/**
 * Get role display name (Vietnamese)
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    editor: 'Biên tập viên',
    writer: 'Cộng tác viên',
    viewer: 'Độc giả',
  };
  return names[role] || role;
}

/**
 * Get all available roles
 */
export function getAllRoles(): UserRole[] {
  return [...roleHierarchy].reverse(); // Return from highest to lowest
}

/**
 * Check if user can edit a specific post
 */
export function canEditPost(
  userRole: UserRole,
  userId: string,
  postAuthorId: string | null
): boolean {
  // Can edit any post
  if (hasPermission(userRole, 'post:edit_any')) {
    return true;
  }
  // Can edit own post
  if (hasPermission(userRole, 'post:edit_own') && postAuthorId === userId) {
    return true;
  }
  return false;
}

/**
 * Check if user can delete a specific post
 */
export function canDeletePost(
  userRole: UserRole,
  userId: string,
  postAuthorId: string | null
): boolean {
  return hasPermission(userRole, 'post:delete');
}

/**
 * Check if user can publish/unpublish posts
 */
export function canPublishPost(userRole: UserRole): boolean {
  return hasPermission(userRole, 'post:publish');
}

/**
 * Middleware helper - Create permission checker
 */
export function createPermissionChecker(requiredPermission: Permission) {
  return (role: UserRole): boolean => hasPermission(role, requiredPermission);
}

/**
 * Middleware helper - Create any permission checker
 */
export function createAnyPermissionChecker(requiredPermissions: Permission[]) {
  return (role: UserRole): boolean => hasAnyPermission(role, requiredPermissions);
}
