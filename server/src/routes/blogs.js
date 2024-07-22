const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Blog = require('../models/Blog');

// @route   POST api/blogs
// @desc    Create a new blog post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id
    });

    const blog = await newBlog.save();
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/blogs
// @desc    Get all blogs for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id }).sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/blogs/:id
// @desc    Get a specific blog
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await blog.remove();
    res.json({ msg: 'Blog removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
