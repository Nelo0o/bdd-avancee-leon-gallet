import express from 'express';
import authorRoutes from './routes/authorRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/authors', authorRoutes);
app.use('/api/posts', postRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Y\' a un sushi !' });
});

app.listen(port, () => {
    console.log(`Le serveur est en marche sur le port ${port}`);
});
