import express from 'express';
import { scriptManager } from '../database/database.js';

const router = express.Router();

// Route pour obtenir les stats des services
router.get('/stats/count', async (req, res) => {
  try {
    const stats = await scriptManager.employeeCountByService();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour obtenir les managers par service
router.get('/stats/managers', async (req, res) => {
  try {
    const services = await scriptManager.managersServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour obtenir la masse salariale par service
router.get('/stats/salary', async (req, res) => {
  try {
    const stats = await scriptManager.topServicesBySalary();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour obtenir l'écart le plus grand entre les salaires
router.get('/stats/salary-range', async (req, res) => {
  try {
    const stats = await scriptManager.salaryRange();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
