// frontend/lib/api/genres.ts
// API service cho genres

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export interface Genre {
  id: number;
  name: string;
  description?: string;
}

export interface GenresResponse {
  message: string;
  data: Genre[];
}

/**
 * Lấy tất cả thể loại
 */
export const getAllGenres = async (): Promise<Genre[]> => {
  try {
    const response = await axios.get<GenresResponse>(`${API_URL}/genres`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all genres:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết thể loại theo ID
 */
export const getGenreById = async (id: number): Promise<Genre> => {
  try {
    const response = await axios.get<{ message: string; data: Genre }>(`${API_URL}/genres/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching genre ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo thể loại mới (Admin only)
 */
export const createGenre = async (genreData: { name: string; description?: string }): Promise<Genre> => {
  try {
    const response = await axios.post<{ message: string; data: Genre }>(`${API_URL}/genres`, genreData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating genre:', error);
    throw error;
  }
};

/**
 * Cập nhật thể loại (Admin only)
 */
export const updateGenre = async (id: number, genreData: { name?: string; description?: string }): Promise<Genre> => {
  try {
    const response = await axios.put<{ message: string; data: Genre }>(`${API_URL}/genres/${id}`, genreData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating genre ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa thể loại (Admin only)
 */
export const deleteGenre = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/genres/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(`Error deleting genre ${id}:`, error);
    throw error;
  }
};
