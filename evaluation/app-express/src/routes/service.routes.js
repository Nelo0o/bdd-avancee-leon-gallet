import express from 'express';
import { scriptManager } from '../database/database.js';

const router = express.Router();

// Route pour créer un nouveau service
router.post('/', async (req, res) => {
  try {
    const { name, office_number } = req.body;

    if (!name || !office_number) {
      return res.status(400).json({
        message: 'Il manque des informations',
        required: ['name', 'office_number']
      });
    }

    const newServiceId = await scriptManager.addService(name, parseInt(office_number));
    res.status(201).json({ id: newServiceId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour mettre à jour un service
router.put('/:id', async (req, res) => {
  try {
    const { name, office_number } = req.body;

    if (!name || !office_number) {
      return res.status(400).json({
        message: 'Il manque des informations',
        required: ['name', 'office_number']
      });
    }

    const result = await scriptManager.updateService(
      parseInt(req.params.id),
      name,
      parseInt(office_number)
    );

    if (!result) {
      return res.status(404).json({ message: 'Le service n\'a pas pu être mis à jour' });
    }
    res.json({ message: 'Service mis à jour' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour supprimer un service
router.delete('/:id', async (req, res) => {
  try {
    const result = await scriptManager.deleteService(parseInt(req.params.id));
    if (!result) {
      return res.status(404).json({ message: 'Le service n\'a pas pu être supprimé' });
    }
    res.status(200).json({ message: 'Service supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
