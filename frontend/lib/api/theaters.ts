// frontend/lib/api/theaters.ts

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export interface Theater {
  id: number;
  name: string;
  total_seats: number;
  seat_map: any;
  theater_type: 'standard' | 'vip' | 'imax' | '3d';
  status: 'active' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface TheaterFormData {
  name: string;
  total_seats: number;
  seat_map?: any;
  theater_type: 'standard' | 'vip' | 'imax' | '3d';
  status: 'active' | 'maintenance';
}

/**
 * Lấy tất cả rạp chiếu
 */
export const getAllTheaters = async (): Promise<Theater[]> => {
  try {
    const response = await axios.get(`${API_URL}/theaters`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching theaters:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết rạp chiếu
 */
export const getTheaterById = async (id: number): Promise<Theater> => {
  try {
    const response = await axios.get(`${API_URL}/theaters/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching theater:', error);
    throw error;
  }
};

/**
 * Tạo rạp chiếu mới (Admin only)
 */
export const createTheater = async (theaterData: TheaterFormData): Promise<Theater> => {
  try {
    const response = await axios.post(`${API_URL}/theaters`, theaterData, {
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating theater:', error);
    throw error;
  }
};

/**
 * Cập nhật rạp chiếu (Admin only)
 */
export const updateTheater = async (id: number, theaterData: Partial<TheaterFormData>): Promise<Theater> => {
  try {
    const response = await axios.put(`${API_URL}/theaters/${id}`, theaterData, {
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating theater:', error);
    throw error;
  }
};

/**
 * Xóa rạp chiếu (Admin only)
 */
export const deleteTheater = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/theaters/${id}`, {
      withCredentials: true
    });
  } catch (error) {
    console.error('Error deleting theater:', error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái rạp chiếu (Admin only)
 */
export const updateTheaterStatus = async (id: number, status: 'active' | 'maintenance'): Promise<Theater> => {
  try {
    const response = await axios.patch(`${API_URL}/theaters/${id}/status`, { status }, {
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating theater status:', error);
    throw error;
  }
};
