import React, { useState, useEffect } from 'react';
import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe } from '../services/api';
import FormField from '../components/FormField';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({ title: '', ingredients: '', instructions: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const response = await fetchRecipes();
      setRecipes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load recipes');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRecipe(editingId, formData);
      } else {
        await createRecipe(formData);
      }
      setFormData({ title: '', ingredients: '', instructions: '' });
      setEditingId(null);
      loadRecipes();
    } catch (err) {
      setError('Failed to save recipe');
    }
  };

  const handleEdit = (recipe) => {
    setFormData({ title: recipe.title, ingredients: recipe.ingredients, instructions: recipe.instructions });
    setEditingId(recipe._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id);
      loadRecipes();
    } catch (err) {
      setError('Failed to delete recipe');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4 bg-recipes-bg bg-cover min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-white">Recipes</h1>
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
          label="Ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          required
          textarea
        />
        <FormField
          label="Instructions"
          name="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          required
          textarea
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          {editingId ? 'Update Recipe' : 'Add Recipe'}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
            <h3 className="text-lg font-semibold mb-1">Ingredients:</h3>
            <p className="mb-2">{recipe.ingredients}</p>
            <h3 className="text-lg font-semibold mb-1">Instructions:</h3>
            <p className="mb-4">{recipe.instructions}</p>
            <div className="flex justify-end">
              <button onClick={() => handleEdit(recipe)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(recipe._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
