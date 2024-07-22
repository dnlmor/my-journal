import React, { useState, useEffect } from 'react';
import { fetchMovies, createMovie, updateMovie, deleteMovie } from '../services/api';
import FormField from '../components/FormField';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({ title: '', director: '', year: '', rating: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await fetchMovies();
      setMovies(response.data.sort((a, b) => b.rating - a.rating));
      setLoading(false);
    } catch (err) {
      setError('Failed to load movies');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMovie(editingId, formData);
      } else {
        await createMovie(formData);
      }
      setFormData({ title: '', director: '', year: '', rating: 0 });
      setEditingId(null);
      loadMovies();
    } catch (err) {
      setError('Failed to save movie');
    }
  };

  const handleEdit = (movie) => {
    setFormData({ title: movie.title, director: movie.director, year: movie.year, rating: movie.rating });
    setEditingId(movie._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMovie(id);
      loadMovies();
    } catch (err) {
      setError('Failed to delete movie');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4 bg-movies-bg bg-cover min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Movies</h1>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="mb-8">
        <FormField
          label="Title"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <FormField
          label="Director"
          name="director"
          value={formData.director}
          onChange={(e) => setFormData({ ...formData, director: e.target.value })}
          required
        />
        <FormField
          label="Year"
          name="year"
          type="number"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          required
        />
        <FormField
          label="Rating"
          name="rating"
          type="number"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          required
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          {editingId ? 'Update Movie' : 'Add Movie'}
        </button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2">Director</th>
            <th className="py-2">Year</th>
            <th className="py-2">Rating</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id}>
              <td className="border px-4 py-2">{movie.title}</td>
              <td className="border px-4 py-2">{movie.director}</td>
              <td className="border px-4 py-2">{movie.year}</td>
              <td className="border px-4 py-2">{movie.rating}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(movie)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(movie._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Movies;
