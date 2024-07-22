import React, { useState, useEffect } from 'react';
import { fetchMVs, createMV, updateMV, deleteMV } from '../services/api';
import FormField from '../components/FormField';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const MVs = () => {
  const [mvs, setMVs] = useState([]);
  const [formData, setFormData] = useState({ title: '', artist: '', url: '', rating: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadMVs();
  }, []);

  const loadMVs = async () => {
    try {
      const response = await fetchMVs();
      setMVs(response.data.sort((a, b) => b.rating - a.rating));
      setLoading(false);
    } catch (err) {
      setError('Failed to load music videos');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      setError('Title and URL are required');
      return;
    }
    try {
      if (editingId) {
        await updateMV(editingId, formData);
      } else {
        await createMV(formData);
      }
      setFormData({ title: '', artist: '', url: '', rating: 0 });
      setEditingId(null);
      loadMVs();
    } catch (err) {
      setError('Failed to save music video');
    }
  };

  const handleEdit = (mv) => {
    setFormData({ title: mv.title, artist: mv.artist, url: mv.url, rating: mv.rating });
    setEditingId(mv._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMV(id);
      loadMVs();
    } catch (err) {
      setError('Failed to delete music video');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Music Videos</h1>
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
          label="Artist"
          name="artist"
          value={formData.artist}
          onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
        />
        <FormField
          label="URL"
          name="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
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
          {editingId ? 'Update Music Video' : 'Add Music Video'}
        </button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2">Artist</th>
            <th className="py-2">URL</th>
            <th className="py-2">Rating</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mvs.map((mv) => (
            <tr key={mv._id}>
              <td className="border px-4 py-2">{mv.title}</td>
              <td className="border px-4 py-2">{mv.artist}</td>
              <td className="border px-4 py-2">
                <a href={mv.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Watch
                </a>
              </td>
              <td className="border px-4 py-2">{mv.rating}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(mv)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(mv._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MVs;
