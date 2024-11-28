import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './src/config/env/.env' });

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
};

let connection;

async function createConnection() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig);
  }
  return connection;
}

// Authors
export const getAllAuthors = async () => {
  const connexion = await createConnection();
  const [results] = await connexion.query('SELECT * FROM authors');
  return results;
};

export const getAuthorById = async (id) => {
  const connexion = await createConnection();
  const [results] = await connexion.query('SELECT * FROM authors WHERE id = ?', [id]);
  return results[0];
};

export const insertOneAuthor = async (authorDetails) => {
  const connexion = await createConnection();
  const { first_name, last_name, email, birthdate } = authorDetails;
  if (!first_name || !last_name || !email) return null;
  try {
    const [results, _] = await connexion.query(
      'INSERT INTO authors (first_name, last_name, email, birthdate) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, birthdate]
    );
    return results.insertId;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateOneAuthor = async (authorDetails) => {
  const connexion = await createConnection();
  const { id, first_name, last_name, email, birthdate } = authorDetails;
  if (!id || !first_name || !last_name || !email) return null;
  try {
    const [results, _] = await connexion.query(
      'UPDATE authors SET first_name = ?, last_name = ?, email = ?, birthdate = ? WHERE id = ?',
      [first_name, last_name, email, birthdate, id]
    );
    const rowModified = results.affectedRows;
    return rowModified === 1;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const searchAuthorByName = async (name) => {
  const connexion = await createConnection();
  const [results] = await connexion.query('SELECT * FROM authors WHERE first_name LIKE ? OR last_name LIKE ?', [
    `%${name}%`,
    `%${name}%`
  ]);
  return results;
}

// Posts
export const getAllPosts = async () => {
  try {
    const connexion = await createConnection();
    const [results] = await connexion.query('SELECT * FROM posts');
    return results;
  } catch (error) {
    console.error('Erreur dans getAllPosts:', error);
    throw error;
  }
};

export const getPostById = async (id) => {
  try {
    const connexion = await createConnection();
    const [results] = await connexion.query('SELECT * FROM posts WHERE id = ?', [id]);
    return results[0];
  } catch (error) {
    console.error('Erreur dans getPostById:', error);
    throw error;
  }
};

export const searchPostByTitle = async (titre) => {
  try {
    const connexion = await createConnection();
    const [results] = await connexion.query('SELECT * FROM posts WHERE title LIKE ?', [`%${titre}%`]);
    return results;
  } catch (error) {
    console.error('Erreur dans searchPostByTitle:', error);
    throw error;
  }
}

export const insertOnePost = async (postDetails) => {
  const connexion = await createConnection();
  const { author_id, title, description, content, date = new Date() } = postDetails;
  if (!author_id || !title || !content) return null;
  try {
    const [results, _] = await connexion.query(
      'INSERT INTO posts (author_id, title, description, content, date) VALUES (?, ?, ?, ?, ?)',
      [author_id, title, description, content, date]
    );
    return results.insertId;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateOnePost = async (postDetails) => {
  const connexion = await createConnection();
  const { id, author_id, title, description, content, date = new Date() } = postDetails;
  if (!id || !author_id || !title || !content) return null;
  try {
    const [results, _] = await connexion.query(
      'UPDATE posts SET author_id = ?, title = ?, description = ?, content = ?, date = ? WHERE id = ?',
      [author_id, title, description, content, date, id]
    );
    const rowModified = results.affectedRows;
    return rowModified === 1;
  } catch (error) {
    console.log(error);
    return null;
  }
};
