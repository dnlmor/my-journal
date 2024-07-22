import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to refresh the token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
    const { token, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', newRefreshToken);
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    return null;
  }
};

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers['x-auth-token'] = newToken;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// API calls (unchanged)
export const fetchBlogs = () => api.get('/blogs');
export const createBlog = (blogData) => api.post('/blogs', blogData);
export const updateBlog = (id, blogData) => api.put(`/blogs/${id}`, blogData);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);

export const fetchSongs = () => api.get('/songs');
export const createSong = (songData) => api.post('/songs', songData);
export const updateSong = (id, songData) => api.put(`/songs/${id}`, songData);
export const deleteSong = (id) => api.delete(`/songs/${id}`);

export const fetchMVs = () => api.get('/musicvideos');
export const createMV = (mvData) => api.post('/musicvideos', mvData);
export const updateMV = (id, mvData) => api.put(`/musicvideos/${id}`, mvData);
export const deleteMV = (id) => api.delete(`/musicvideos/${id}`);

export const fetchMovies = () => api.get('/movies');
export const createMovie = (movieData) => api.post('/movies', movieData);
export const updateMovie = (id, movieData) => api.put(`/movies/${id}`, movieData);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);

export const fetchRecipes = () => api.get('/recipes');
export const createRecipe = (recipeData) => api.post('/recipes', recipeData);
export const updateRecipe = (id, recipeData) => api.put(`/recipes/${id}`, recipeData);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);

export default api;
