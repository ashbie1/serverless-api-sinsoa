const express = require('express');
const AuthorModel = require('../models/author'); // Ensure the correct path to the model

const router = express.Router();

// GET all authors
router.get('/', async (req, res) => {
  try {
    const authors = await AuthorModel.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single author
router.get('/:id', getAuthor, (req, res) => {
  res.json(res.author);
});

// CREATE an author
router.post('/', async (req, res) => {
  try {
    // Validate request body
    if (!req.body.artist || !req.body.song || !req.body.ratings) {
      return res.status(400).json({ message: 'Artist, song, and ratings are required' });
    } else if (req.body.ratings < 1 || req.body.ratings > 5) {
      return res.status(400).json({ message: 'Ratings must be between 1 and 5' });
    }

    // Check if the artist and song combination already exists
    const existingAuthor = await AuthorModel.findOne({ artist: req.body.artist, song: req.body.song });
    if (existingAuthor) {
      return res.status(400).json({ message: 'This artist and song combination already exists' });
    }

    const author = new AuthorModel(req.body);
    const newAuthor = await author.save();
    res.status(201).json({ message: 'Author created successfully', author: newAuthor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE an author
router.patch('/:id', getAuthor, async (req, res) => {
  try {
    if (req.body.artist != null) {
      res.author.artist = req.body.artist;
    }
    if (req.body.song != null) {
      res.author.song = req.body.song;
    }
    if (req.body.ratings != null) {
      if (req.body.ratings < 1 || req.body.ratings > 5) {
        return res.status(400).json({ message: 'Ratings must be between 1 and 5' });
      }
      res.author.ratings = req.body.ratings;
    }
    const updatedAuthor = await res.author.save();
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', getAuthor, async (req, res) => {
  try {
    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an author
router.delete('/:id', getAuthor, async (req, res) => {
  try {
    await AuthorModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Author deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a single author by ID
async function getAuthor(req, res, next) {
  try {
    const author = await AuthorModel.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.author = author;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = router;
