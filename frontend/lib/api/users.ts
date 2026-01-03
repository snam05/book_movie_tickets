// frontend/lib/api/users.ts

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export interface User {
  id: number;
  email: string;
  full_name: string;
  cccd_number: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  member_code: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  total: number;
  admins: number;
  users: number;
}

/**
 * Lấy tất cả users (Admin only)
 */
export const getAllUsers = async (filters?: { role?: string; search?: string }): Promise<User[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await axios.get(`${API_URL}/admin/users?${params.toString()}`, {
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết user (Admin only)
 */
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await axios.get(`${API_URL}/admin/users/${id}`, {
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Cập nhật role user (Admin only)
 */
export const updateUserRole = async (id: number, role: 'user' | 'admin'): Promise<User> => {
  try {
    const response = await axios.patch(`${API_URL}/admin/users/${id}/role`, { role }, {
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

/**
 * Xóa user (Admin only)
 */
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/admin/users/${id}`, {
      withCredentials: true
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Lấy thống kê users (Admin only)
 */
export const getUserStats = async (): Promise<UserStats> => {
  try {
    const response = await axios.get(`${API_URL}/admin/users/stats`, {
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};
