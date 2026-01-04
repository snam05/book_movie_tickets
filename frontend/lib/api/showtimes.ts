// frontend/lib/api/showtimes.ts

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export interface Showtime {
  id: number;
  movie_id: number;
  theater_id: number;
  showtime_date: string;
  showtime_time: string;
  price: string;
  available_seats: number;
  status: 'normal' | 'canceled';
  display_status?: 'scheduled' | 'showing' | 'completed' | 'canceled';
  movie?: {
    id: number;
    title: string;
    poster_url?: string;
    duration?: number;
  };
  theater?: {
    id: number;
    name: string;
    theater_type?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ShowtimeFormData {
  movie_id: number;
  theater_id: number;
  showtime_date: string;
  showtime_time: string;
  price: string | number;
  status?: 'normal' | 'canceled';
}

export interface ShowtimesResponse {
  message: string;
  data: Showtime[];
  count?: number;
}

/**
 * Lấy tất cả lịch chiếu
 */
export const getAllShowtimes = async (): Promise<Showtime[]> => {
  try {
    const response = await axios.get<ShowtimesResponse>(`${API_URL}/showtimes`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết lịch chiếu theo ID
 */
export const getShowtimeById = async (id: number): Promise<Showtime> => {
  try {
    const response = await axios.get<{ message: string; data: Showtime }>(`${API_URL}/showtimes/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching showtime ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo lịch chiếu mới (Admin only)
 */
export const createShowtime = async (showtimeData: ShowtimeFormData): Promise<Showtime> => {
  try {
    const response = await axios.post<{ message: string; data: Showtime }>(
      `${API_URL}/showtimes`,
      showtimeData,
      {
        withCredentials: true
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error creating showtime:', error);
    throw error;
  }
};

/**
 * Cập nhật lịch chiếu (Admin only)
 */
export const updateShowtime = async (id: number, showtimeData: Partial<ShowtimeFormData>): Promise<Showtime> => {
  try {
    const response = await axios.put<{ message: string; data: Showtime }>(
      `${API_URL}/showtimes/${id}`,
      showtimeData,
      {
        withCredentials: true
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating showtime ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa lịch chiếu (Admin only)
 */
export const deleteShowtime = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/showtimes/${id}`, {
      withCredentials: true
    });
  } catch (error) {
    console.error(`Error deleting showtime ${id}:`, error);
    throw error;
  }
};
