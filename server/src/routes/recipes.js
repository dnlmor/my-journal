const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');

// @route   POST api/recipes
// @desc    Create a new recipe
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newRecipe = new Recipe({
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      servings: req.body.servings,
      user: req.user.id
    });

    const recipe = await newRecipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/recipes
// @desc    Get all recipes for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/recipes/:id
// @desc    Get a specific recipe
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/recipes/:id
// @desc    Update a recipe
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(recipe);
} catch (err) {
  console.error(err.message);
  if (err.kind === 'ObjectId') {
    return res.status(404).json({ msg: 'Recipe not found' });
  }
  res.status(500).send('Server Error');
}
});

// @route   DELETE api/recipes/:id
// @desc    Delete a recipe
// @access  Private
router.delete('/:id', auth, async (req, res) => {
try {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ msg: 'Recipe not found' });
  }
  if (recipe.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'User not authorized' });
  }
  await recipe.remove();
  res.json({ msg: 'Recipe removed' });
} catch (err) {
  console.error(err.message);
  if (err.kind === 'ObjectId') {
    return res.status(404).json({ msg: 'Recipe not found' });
  }
  res.status(500).send('Server Error');
}
});

module.exports = router;
