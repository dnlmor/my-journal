const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Song = require('../models/Song');

// @route   POST api/songs
// @desc    Create a new song
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newSong = new Song({
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album,
      releaseDate: req.body.releaseDate,
      rating: req.body.rating,
      user: req.user.id
    });

    const song = await newSong.save();
    res.json(song);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/songs
// @desc    Get all songs for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const songs = await Song.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/songs/:id
// @desc    Get a specific song
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ msg: 'Song not found' });
    }
    if (song.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(song);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Song not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/songs/:id
// @desc    Update a song
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ msg: 'Song not found' });
    }
    if (song.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    song = await Song.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(song);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Song not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/songs/:id
// @desc    Delete a song
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ msg: 'Song not found' });
    }
    if (song.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await song.remove();
    res.json({ msg: 'Song removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Song not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
