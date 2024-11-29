import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './config/env/.env' });

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
};

let connection = null;

export const initConnection = async () => {
  connection = await mysql.createConnection(dbConfig);
  return connection;
};

export const getConnection = () => {
  if (!connection) {
    throw new Error('Problème de connexion');
  }
  return connection;
};

export const closeConnection = async () => {
  if (connection) {
    await connection.end();
    connection = null;
  }
};

export const scriptManager = {
  getEmployeeById: async (id) => {
    const conn = getConnection();
    const [results] = await conn.query('SELECT * FROM employees WHERE id = ?', [id]);
    return results[0];
  },

  getEmployeeByService: async (serviceName) => {
    const conn = getConnection();
    const [results] = await conn.query(
      `SELECT employees.*
             FROM employees
             JOIN services ON employees.service_id = services.id
             WHERE services.name LIKE ?`,
      [`%${serviceName}%`]
    );
    return results;
  },

  addEmployee: async (employeeDetails) => {
    const conn = getConnection();
    const { first_name, last_name, email, salary, service_id } = employeeDetails;
    if (!first_name || !last_name || !email || !salary || !service_id) return null;

    try {
      await conn.beginTransaction();

      // Création d'un nouveeau Didier
      const [employeeResult] = await conn.query(
        'INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES (?, ?, ?, ?, ?)',
        [first_name, last_name, email, salary, service_id]
      );

      // Mettre à jour aussi la table manage
      await conn.query(
        'INSERT INTO manage (employee_id, service_id, start_date) VALUES (?, ?, CURRENT_DATE)',
        [employeeResult.insertId, service_id]
      );

      await conn.commit();

      // Récupérer les informations complètes du Didier
      const [employeeInfo] = await conn.query(
        `SELECT employees.*, services.name as service_name, manage.start_date
                 FROM employees
                 JOIN services ON employees.service_id = services.id
                 JOIN manage ON employees.id = manage.employee_id
                 WHERE employees.id = ?`,
        [employeeResult.insertId]
      );

      return employeeInfo[0];
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  },

  updateEmployee: async (id, employeeDetails) => {
    const conn = getConnection();
    const { first_name, last_name, email, salary, service_id } = employeeDetails;
    if (!first_name || !last_name || !email || !salary || !service_id) return null;

    try {
      await conn.beginTransaction();

      // Mise à jour du Didier
      await conn.query(
        'UPDATE employees SET first_name = ?, last_name = ?, email = ?, salary = ?, service_id = ? WHERE id = ?',
        [first_name, last_name, email, salary, service_id, id]
      );

      // Mise à jour de la table manage aussi
      await conn.query(
        'UPDATE manage SET service_id = ?, start_date = CURRENT_DATE WHERE employee_id = ?',
        [service_id, id]
      );

      await conn.commit();

      // Récupérer les informations mises à jour du Didier
      const [employeeInfo] = await conn.query(
        `SELECT employees.*, services.name as service_name, manage.start_date
                 FROM employees
                 JOIN services ON employees.service_id = services.id
                 JOIN manage ON employees.id = manage.employee_id
                 WHERE employees.id = ?`,
        [id]
      );

      return employeeInfo[0];
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  },

  deleteEmployee: async (id) => {
    const conn = getConnection();
    try {
      await conn.beginTransaction();

      // Je supprime d'abord la reference du Didier dans la table manage pour éviter une erreur liée au contrainte de clé étrangère
      await conn.query('DELETE FROM manage WHERE employee_id = ?', [id]);

      // Ensuite supprimer le Didier
      await conn.query('DELETE FROM employees WHERE id = ?', [id]);

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  },

  addService: async (serviceName, officeNumber) => {
    const conn = getConnection();
    try {
      const [results, _] = await conn.query(
        'INSERT INTO services (name, office_number) VALUES (?, ?)',
        [serviceName, officeNumber]
      );
      return results.insertId;
    } catch (error) {
      throw error;
    }
  },

  updateService: async (id, serviceName, officeNumber) => {
    const conn = getConnection();
    try {
      const [results, _] = await conn.query(
        'UPDATE services SET name = ?, office_number = ? WHERE id = ?',
        [serviceName, officeNumber, id]
      );
      return results.affectedRows === 1;
    } catch (error) {
      throw error;
    }
  },

  deleteService: async (id) => {
    const conn = getConnection();
    try {
      await conn.beginTransaction();

      // D'abord je récupère tous les Didier du service
      const [employees] = await conn.query('SELECT id FROM employees WHERE service_id = ?', [id]);

      // Pour chaque Didier, supprimer ses entrées dans manage
      for (const employee of employees) {
        await conn.query('DELETE FROM manage WHERE employee_id = ?', [employee.id]);
      }

      // Supprimer tous les Didier du service
      await conn.query('DELETE FROM employees WHERE service_id = ?', [id]);

      // Et enfin supprimer le service
      const [result] = await conn.query('DELETE FROM services WHERE id = ?', [id]);

      await conn.commit();
      return result.affectedRows === 1;
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  },

  // Procédures et fonctions
  employeeCountByService: async () => {
    const conn = getConnection();
    try {
      const [results] = await conn.query('CALL employee_count_by_service()');
      return results[0];
    } catch (error) {
      throw error;
    }
  },

  managersServices: async () => {
    const conn = getConnection();
    try {
      const [results] = await conn.query('CALL managers_services()');
      return results[0];
    } catch (error) {
      throw error;
    }
  },

  topServicesBySalary: async () => {
    const conn = getConnection();
    try {
      const [results] = await conn.query('CALL top_services_by_salary()');
      return results[0];
    } catch (error) {
      throw error;
    }
  },

  salaryRange: async () => {
    const conn = getConnection();
    try {
      const [results] = await conn.query('SELECT salary_range() as salary_range');
      return results[0].salary_range;
    } catch (error) {
      throw error;
    }
  }

};
