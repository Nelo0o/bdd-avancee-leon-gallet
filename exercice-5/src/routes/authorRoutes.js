import express from 'express';
import { getAllAuthors, getAuthorById, searchAuthorByName, insertOneAuthor, updateOneAuthor } from '../data/database.js';

const router = express.Router();

// Get all authors
router.get('/', async (req, res) => {
    try {
        const authors = await getAllAuthors();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get author by id
router.get('/:id', async (req, res) => {
    const authorId = req.params.id;
    try {
        const author = await getAuthorById(authorId);
        if (author) {
            res.json(author);
        } else {
            res.status(404).json({ message: 'Pas d\'auteur avec cet ID' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search author by name
router.get('/search/:name', async (req, res) => {
    const authorName = req.params.name;
    try {
        const authors = await searchAuthorByName(authorName);
        res.json(authors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create author
router.post('/', async (req, res) => {
    const authorDetails = req.body;
    try {
        const authorId = await insertOneAuthor(authorDetails);
        res.status(201).json({ id: authorId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update author
router.put('/:id', async (req, res) => {
    const authorDetails = {id: req.params.id, ...req.body};
    try {
        const updated = await updateOneAuthor(authorDetails);
        if (updated) {
            res.json({ message: 'Auteur mis à jour' });
        } else {
            res.status(404).json({ message: 'Pas d\'auteur avec cet ID' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
