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
  role: 'customer' | 'admin';
  is_active: boolean;
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
export const updateUserRole = async (id: number, role: 'customer' | 'admin'): Promise<User> => {
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

export interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  cccd_number: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  role?: 'customer' | 'admin';
  is_active?: boolean;
}

/**
 * Tạo user mới (Admin only)
 */
export const createUser = async (userData: CreateUserData): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/admin/users`, userData, {
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export interface UpdateUserData {
  email?: string;
  full_name?: string;
  phone_number?: string;
  cccd_number?: string;
  date_of_birth?: string;
  gender?: string;
  is_active?: boolean;
}

/**
 * Cập nhật thông tin user (Admin only)
 */
export const updateUser = async (id: number, userData: UpdateUserData): Promise<User> => {
  try {
    const response = await axios.put(`${API_URL}/admin/users/${id}`, userData, {
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Đặt mật khẩu mới cho user (Admin only)
 */
export const setUserPassword = async (id: number, password: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/admin/users/${id}/password`, { password }, {
      withCredentials: true
    });
  } catch (error) {
    console.error('Error setting user password:', error);
    throw error;
  }
};

/**
 * Kích hoạt/Vô hiệu hóa tài khoản user (Admin only)
 */
export const toggleUserStatus = async (id: number, is_active: boolean): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/admin/users/${id}/status`, { is_active }, {
      withCredentials: true
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};
