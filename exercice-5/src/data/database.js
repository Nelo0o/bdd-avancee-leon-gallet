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

async function createConnection() {
  return await mysql.createConnection(dbConfig);
}

export const getAllAuthors = async () => {
  const connexion = await createConnection();
  try {
    const [results, fields] = await connexion.query('SELECT * FROM authors');
    return results;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAuthorById = async (authorId) => {
  const connexion = await createConnection();
  try {
    const [results, fields] = await connexion.query('SELECT * FROM authors WHERE id = ?', [authorId]);
    return results;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const insertOneAuthor = async (authorDetails) => {
  const { first_name, last_name, email, birthdate } = authorDetails;
  if (!first_name || !last_name || !email) return null;
  const connexion = await createConnection();
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

export const insertManyAuthors = async (authorsDetails) => {
  const connexion = await createConnection();
  const insertedIds = authorsDetails.map(async (authorDetails) => await insertOneAuthor(connexion, authorDetails));
  return Promise.all(insertedIds);
};

export const updateOneAuthor = async (authorDetails) => {
  const { id, first_name, last_name, email, birthdate } = authorDetails;
  if (!id || !first_name || !last_name || !email) return null;
  const connexion = await createConnection();
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

export const updateManyAuthors = async (authorsDetails) => {
  const connexion = await createConnection();
  const insertedIds = authorsDetails.map(async (authorDetails) => await updateOneAuthor(connexion, authorDetails));
  return Promise.all(insertedIds);
};
