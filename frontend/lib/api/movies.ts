// frontend/lib/api/movies.ts
// API service cho movies

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export interface Genre {
  id: number;
  name: string;
}

export interface Theater {
  id: number;
  name: string;
  theater_type: string;
}

export interface ShowtimeFromAPI {
  id: number;
  showtime_date: string;
  showtime_time: string;
  price: string;
  available_seats: number;
  status: string;
  theater: Theater;
}

export interface MovieFromAPI {
  id: number;
  title: string;
  description: string;
  duration: number;
  release_date: string;
  poster_url: string;
  trailer_url: string;
  director: string;
  actors: string;
  rating: number;
  age_rating: string;
  status: 'coming_soon' | 'now_showing' | 'ended';
  genres: Genre[];
  showtimes?: ShowtimeFromAPI[];
  created_at?: string;
  updated_at?: string;
}

export interface MoviesResponse {
  message: string;
  data: MovieFromAPI[];
  count: number;
}

/**
 * Lấy tất cả phim
 */
export const getAllMovies = async (): Promise<MovieFromAPI[]> => {
  try {
    const response = await axios.get<MoviesResponse>(`${API_URL}/movies`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all movies:', error);
    throw error;
  }
};

/**
 * Lấy phim đang chiếu
 */
export const getNowShowingMovies = async (): Promise<MovieFromAPI[]> => {
  try {
    const response = await axios.get<MoviesResponse>(`${API_URL}/movies/now-showing`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching now showing movies:', error);
    throw error;
  }
};

/**
 * Lấy phim sắp chiếu
 */
export const getComingSoonMovies = async (): Promise<MovieFromAPI[]> => {
  try {
    const response = await axios.get<MoviesResponse>(`${API_URL}/movies/coming-soon`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching coming soon movies:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết phim theo ID
 */
export const getMovieById = async (id: number): Promise<MovieFromAPI> => {
  try {
    const response = await axios.get<{ message: string; data: MovieFromAPI }>(`${API_URL}/movies/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo phim mới (Admin only)
 */
export const createMovie = async (formData: FormData): Promise<MovieFromAPI> => {
  try {
    const response = await axios.post<{ message: string; data: MovieFromAPI }>(`${API_URL}/movies`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error;
  }
};

/**
 * Cập nhật phim (Admin only)
 */
export const updateMovie = async (id: number, formData: FormData): Promise<MovieFromAPI> => {
  try {
    const response = await axios.put<{ message: string; data: MovieFromAPI }>(`${API_URL}/movies/${id}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating movie ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa phim (Admin only)
 */
export const deleteMovie = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/movies/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(`Error deleting movie ${id}:`, error);
    throw error;
  }
};

/**
 * Helper: Convert MovieFromAPI to Movie type (for compatibility)
 */
export const convertToMovieType = (apiMovie: MovieFromAPI) => {
  return {
    id: apiMovie.id,
    title: apiMovie.title,
    posterUrl: apiMovie.poster_url,
    genre: apiMovie.genres?.map(g => g.name) || [],
    duration: apiMovie.duration,
    rating: apiMovie.rating
  };
};
