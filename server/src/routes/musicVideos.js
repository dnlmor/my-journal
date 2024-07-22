const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MusicVideo = require('../models/MusicVideo');

// @route   POST api/musicvideos
// @desc    Create a new music video
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newMusicVideo = new MusicVideo({
      title: req.body.title,
      artist: req.body.artist,
      releaseDate: req.body.releaseDate,
      url: req.body.url,
      rating: req.body.rating,
      user: req.user.id
    });

    const musicVideo = await newMusicVideo.save();
    res.json(musicVideo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/musicvideos
// @desc    Get all music videos for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const musicVideos = await MusicVideo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(musicVideos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/musicvideos/:id
// @desc    Get a specific music video
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const musicVideo = await MusicVideo.findById(req.params.id);
    if (!musicVideo) {
      return res.status(404).json({ msg: 'Music video not found' });
    }
    if (musicVideo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(musicVideo);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Music video not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/musicvideos/:id
// @desc    Update a music video
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let musicVideo = await MusicVideo.findById(req.params.id);
    if (!musicVideo) {
      return res.status(404).json({ msg: 'Music video not found' });
    }
    if (musicVideo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    musicVideo = await MusicVideo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(musicVideo);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Music video not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/musicvideos/:id
// @desc    Delete a music video
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const musicVideo = await MusicVideo.findById(req.params.id);
    if (!musicVideo) {
      return res.status(404).json({ msg: 'Music video not found' });
    }
    if (musicVideo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await musicVideo.remove();
    res.json({ msg: 'Music video removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Music video not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
