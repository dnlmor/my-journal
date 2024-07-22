const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Movie = require('../models/Movie');

// @route   POST api/movies
// @desc    Create a new movie
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newMovie = new Movie({
      title: req.body.title,
      director: req.body.director,
      releaseDate: req.body.releaseDate,
      genre: req.body.genre,
      rating: req.body.rating,
      user: req.user.id
    });

    const movie = await newMovie.save();
    res.json(movie);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/movies
// @desc    Get all movies for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/movies/:id
// @desc    Get a specific movie
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    if (movie.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(movie);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/movies/:id
// @desc    Update a movie
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    if (movie.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(movie);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/movies/:id
// @desc    Delete a movie
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    if (movie.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await movie.remove();
    res.json({ msg: 'Movie removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
