import express from 'express';
import { scriptManager } from '../database/database.js';

const router = express.Router();

// Route pour obtenir un Didier par son ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await scriptManager.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Pas de Didier avec cet ID' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour obtenir les Didier d'un service
router.get('/service/:name', async (req, res) => {
  try {
    const employees = await scriptManager.getEmployeeByService(req.params.name);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour ajouter un nouveau Didier
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, salary, service_id } = req.body;

    if (!first_name || !last_name || !email || !salary || !service_id) {
      return res.status(400).json({
        message: 'Il manque des informations',
        required: ['first_name', 'last_name', 'email', 'salary', 'service_id']
      });
    }

    // Vérifier si le service existe
    const serviceExists = await scriptManager.getServiceById(parseInt(service_id));
    if (!serviceExists) {
      return res.status(400).json({
        message: 'Ce service n\'existe pas',
        service_id: service_id
      });
    }

    const newEmployee = await scriptManager.addEmployee({
      first_name,
      last_name,
      email,
      salary: parseFloat(salary),
      service_id: parseInt(service_id)
    });

    if (!newEmployee) {
      return res.status(400).json({ message: 'Les données ne sont pas valides' });
    }

    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour mettre à jour un Didier
router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, salary, service_id } = req.body;

    if (!first_name || !last_name || !email || !salary || !service_id) {
      return res.status(400).json({
        message: 'Il manque des informations',
        required: ['first_name', 'last_name', 'email', 'salary', 'service_id']
      });
    }

    // Vérifier si le service existe
    const serviceExists = await scriptManager.getServiceById(parseInt(service_id));
    if (!serviceExists) {
      return res.status(400).json({
        message: 'Le service spécifié n\'existe pas',
        service_id: service_id
      });
    }

    const updatedEmployee = await scriptManager.updateEmployee(parseInt(req.params.id), {
      first_name,
      last_name,
      email,
      salary: parseFloat(salary),
      service_id: parseInt(service_id)
    });

    if (!updatedEmployee) {
      return res.status(400).json({ message: 'Les données ne sont pas valides' });
    }

    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour supprimer un Didier
router.delete('/:id', async (req, res) => {
  try {
    const result = await scriptManager.deleteEmployee(parseInt(req.params.id));
    if (!result) {
      return res.status(404).json({ message: 'Pas de Didier avec cet ID' });
    }
    res.status(200).json({ message: 'Didier supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
