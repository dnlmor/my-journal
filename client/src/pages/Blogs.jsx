import React, { useState, useEffect } from 'react';
import { fetchBlogs, createBlog, updateBlog, deleteBlog } from '../services/api';
import ItemCard from '../components/ItemCard';
import FormField from '../components/FormField';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await fetchBlogs();
      setBlogs(response.data || []); // Ensure blogs is always an array
      setLoading(false);
    } catch (err) {
      console.error('Error loading blogs:', err);
      setError('Failed to load blogs');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBlog(editingId, formData);
      } else {
        await createBlog(formData);
      }
      setFormData({ title: '', content: '' });
      setEditingId(null);
      loadBlogs();
    } catch (err) {
      console.error('Error saving blog:', err);
      setError('Failed to save blog');
    }
  };

  const handleEdit = (blog) => {
    setFormData({ title: blog.title, content: blog.content });
    setEditingId(blog._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      loadBlogs();
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete blog');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="mb-8">
        <FormField
          label="Title"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <FormField
          label="Content"
          name="content"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          required
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          {editingId ? 'Update Blog' : 'Add Blog'}
        </button>
      </form>
      <div>
        {blogs && blogs.length > 0 ? (
          blogs.map(blog => (
            <ItemCard
              key={blog._id}
              title={blog.title}
              content={blog.content}
              onEdit={() => handleEdit(blog)}
              onDelete={() => handleDelete(blog._id)}
            />
          ))
        ) : (
          <p>No blogs available</p>
        )}
      </div>
    </div>
  );
};

export default Blogs;
