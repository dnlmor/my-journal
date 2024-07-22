import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs, fetchSongs, fetchMVs, fetchMovies, fetchRecipes } from '../services/api';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [mvs, setMVs] = useState([]);
  const [movies, setMovies] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const blogsData = await fetchBlogs();
        const songsData = await fetchSongs();
        const mvsData = await fetchMVs();
        const moviesData = await fetchMovies();
        const recipesData = await fetchRecipes();
        setBlogs(blogsData.data.slice(0, 2));
        setSongs(songsData.data.slice(0, 2));
        setMVs(mvsData.data.slice(0, 2));
        setMovies(moviesData.data.slice(0, 2));
        setRecipes(recipesData.data.slice(0, 2));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const renderCategory = (title, items, link) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-700">{item.content || item.artist || item.director || item.ingredients}</p>
          </div>
        ))}
      </div>
      <Link to={link} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        View All {title}
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-home-bg bg-cover p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-white">Welcome to MyJournal</h1>
      {renderCategory('Blogs', blogs, '/blogs')}
      {renderCategory('Songs', songs, '/songs')}
      {renderCategory('Music Videos', mvs, '/mvs')}
      {renderCategory('Movies', movies, '/movies')}
      {renderCategory('Recipes', recipes, '/recipes')}
    </div>
  );
};

export default Home;
