import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({ path: './src/config/env/.env' });

async function firstConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
  });

  console.log('ça semble fonctionner');

  try {
    // Un SELECT tout à fait normal
    const [authors] = await connection.query('SELECT * FROM authors LIMIT 5');
    console.log(authors);

    // Un SELECT avec une fonction stockée
    const [name_short] = await connection.query(
      'SELECT fullname_short(first_name, last_name) AS name_short FROM authors LIMIT 5'
    );
    console.log(name_short);

    // Un CALL d'une procédure stockée
    const [last_post] = await connection.query('CALL last_post_from_author(5)');
    console.log(last_post);

  } catch (error) {
    console.error('Oupssssss :', error.message);
  } finally {
    await connection.end();
  }
}

firstConnection();
