import React, { useState, useEffect } from 'react';
import { fetchSongs, createSong, updateSong, deleteSong } from '../services/api';
import FormField from '../components/FormField';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [formData, setFormData] = useState({ title: '', artist: '', album: '', rating: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingSongId, setDeletingSongId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const response = await fetchSongs();
      setSongs(response.data.sort((a, b) => b.rating - a.rating));
      setLoading(false);
    } catch (err) {
      setError('Failed to load songs');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSong(editingId, formData);
      } else {
        await createSong(formData);
      }
      setFormData({ title: '', artist: '', album: '', rating: 0 });
      setEditingId(null);
      loadSongs();
    } catch (err) {
      setError('Failed to save song');
    }
  };

  const handleEdit = (song) => {
    setFormData({ title: song.title, artist: song.artist, album: song.album, rating: song.rating });
    setEditingId(song._id);
  };

  const handleDeleteClick = (id) => {
    setDeletingSongId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSong(deletingSongId);
      loadSongs();
      setIsDeleteDialogOpen(false);
    } catch (err) {
      setError('Failed to delete song');
    }
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.album.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4 bg-songs-bg bg-cover min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-white">Songs</h1>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
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
          required
        />
        <FormField
          label="Album"
          name="album"
          value={formData.album}
          onChange={(e) => setFormData({ ...formData, album: e.target.value })}
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
          {editingId ? 'Update Song' : 'Add Song'}
        </button>
      </form>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search songs..."
          className="w-full p-2 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2">Artist</th>
            <th className="py-2">Album</th>
            <th className="py-2">Rating</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSongs.map((song) => (
            <tr key={song._id}>
              <td className="border px-4 py-2">{song.title}</td>
              <td className="border px-4 py-2">{song.artist}</td>
              <td className="border px-4 py-2">{song.album}</td>
              <td className="border px-4 py-2">{song.rating}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(song)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
                <button onClick={() => handleDeleteClick(song._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this song?"
      />
    </div>
  );
};

export default Songs;
