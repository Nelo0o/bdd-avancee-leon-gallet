import express from 'express';
import { getAllPosts, getPostById, searchPostByTitle, insertOnePost, updateOnePost } from '../data/database.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get post by id
router.get('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await getPostById(postId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Pas de post avec cet ID' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts by title
router.get('/search/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const posts = await searchPostByTitle(title);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post
router.post('/', async (req, res) => {
  const postDetails = req.body;
  try {
    const postId = await insertOnePost(postDetails);
    if (postId) {
      res.json({ message: 'Post créé', id: postId });
    } else {
      res.status(400).json({ message: 'Post non créé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update post
router.put('/:id', async (req, res) => {
  const postDetails = {id: req.params.id, ...req.body};
  try {
    const updated = await updateOnePost(postDetails);
    if (updated) {
      res.json({ message: 'Post mis à jour' });
    } else {
      res.status(404).json({ message: 'Pas de post avec cet ID' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
