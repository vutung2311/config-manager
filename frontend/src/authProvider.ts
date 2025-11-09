import type { AuthProvider } from '@refinedev/core';
import { notification } from 'antd';
import PocketBase from 'pocketbase/cjs';
import { POCKETBASE_URL } from './config';

export const pb = new PocketBase(POCKETBASE_URL);

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      // Try to authenticate with _superusers collection first
      await pb.collection('_superusers').authWithPassword(email as string, password as string);
      // Store the collection used for authentication
      localStorage.setItem('auth_collection', '_superusers');
      return {
        success: true,
        redirectTo: '/',
      };
    } catch (_superuserError: unknown) {
      try {
        // If _superusers fails, try users collection
        await pb.collection('users').authWithPassword(email as string, password as string);
        // Store the collection used for authentication
        localStorage.setItem('auth_collection', 'users');
        return {
          success: true,
          redirectTo: '/',
        };
      } catch (_userError: unknown) {
        return {
          success: false,
          error: {
            message: 'Login failed',
            name: 'Invalid email or password',
          },
        };
      }
    }
  },
  updatePassword: async params => {
    try {
      if (!pb.authStore.isValid) {
        throw new Error('Not authenticated');
      }

      const data = {
        oldPassword: params.oldPassword,
        password: params.password,
        passwordConfirm: params.password,
      };

      // Use the collection from which the user authenticated
      const authCollection = localStorage.getItem('auth_collection') || 'users';
      await pb.collection(authCollection).update(pb.authStore.model!.id, data);

      notification.success({
        message: 'Updated Password',
        description: 'Password updated successfully',
      });
      return {
        success: true,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: {
          message: 'Update password failed',
          name: error instanceof Error ? error.message : 'Failed to update password',
        },
      };
    }
  },
  forgotPassword: async ({ email }) => {
    try {
      // Try to request password reset for users collection first
      await pb.collection('users').requestPasswordReset(email as string);
      notification.success({
        message: 'Reset Password',
        description: `Reset password link sent to "${email}"`,
      });
      return {
        success: true,
      };
    } catch (_userError: unknown) {
      try {
        // If users collection fails, try _superusers collection
        await pb.collection('_superusers').requestPasswordReset(email as string);
        notification.success({
          message: 'Reset Password',
          description: `Reset password link sent to "${email}"`,
        });
        return {
          success: true,
        };
      } catch (_superuserError: unknown) {
        return {
          success: false,
          error: {
            message: 'Reset password failed',
            name: 'Failed to send reset email',
          },
        };
      }
    }
  },
  logout: async () => {
    pb.authStore.clear();
    localStorage.removeItem('auth_collection');
    return {
      success: true,
      redirectTo: '/login',
    };
  },
  onError: async error => {
    if (error.response?.status === 401) {
      notification.error({
        message: 'Authentication Error',
        description: 'Authentication token expired. Please login again.',
      });
      pb.authStore.clear();
      localStorage.removeItem('auth_collection');
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    if (pb.authStore.isValid) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        message: 'Check failed',
        name: 'Not authenticated',
      },
      logout: true,
      redirectTo: '/login',
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    if (!pb.authStore.isValid || !pb.authStore.model) {
      return null;
    }

    const user = pb.authStore.model;
    return {
      id: user.id,
      name: user.email, // You might want to add a name field to your users collection
      avatar: user.avatar ? pb.files.getUrl(user, user.avatar) : 'https://i.pravatar.cc/150',
    };
  },
};
