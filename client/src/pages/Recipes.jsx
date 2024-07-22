import React, { useState, useEffect } from 'react';
import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe } from '../services/api';
import ItemCard from '../components/ItemCard';
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
      const { data } = await fetchRecipes();
      setRecipes(data);
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Recipes</h1>
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
          label="Ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          required
        />
        <FormField
          label="Instructions"
          name="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          required
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          {editingId ? 'Update Recipe' : 'Add Recipe'}
        </button>
      </form>
      <div>
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <ItemCard
              key={recipe._id}
              title={recipe.title}
              content={`Ingredients: ${recipe.ingredients}, Instructions: ${recipe.instructions}`}
              onEdit={() => handleEdit(recipe)}
              onDelete={() => handleDelete(recipe._id)}
            />
          ))
        ) : (
          <p>No recipes available</p>
        )}
      </div>
    </div>
  );
};

export default Recipes;
