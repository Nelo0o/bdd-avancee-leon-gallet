import express from 'express';
import { config } from 'dotenv';
import { initConnection } from './database/database.js';
import employeeRoutes from './routes/employee.routes.js';
import serviceRoutes from './routes/service.routes.js';
import functionsRoutes from './routes/functions.routes.js';

config({ path: './config/env/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/functions', functionsRoutes);

// Je démarre la connexion à la base de données et démarre le serveur
initConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Le serveur tourne sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Echec à l\'initialisation de la base de données:', err);
    process.exit(1);
  });
