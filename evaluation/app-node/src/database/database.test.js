import { scriptManager, initConnection, closeConnection, getConnection } from './database.js';

let newEmployeeId;
let testServiceId;

beforeAll(async () => {
  await initConnection();
  const conn = getConnection();

  // Nettoyer les données de test précédentes
  await conn.query("DELETE FROM manage WHERE employee_id IN (SELECT id FROM employees WHERE email='didier.test@test.com')");
  await conn.query("DELETE FROM employees WHERE email='didier.test@test.com'");
  await conn.query("DELETE FROM services WHERE name='Service Test'");

  // Créer un service de test pour éviter les contraintes de clé étrangère lors des tests
  const [serviceResult] = await conn.query(
    'INSERT INTO services (name, office_number) VALUES (?, ?)',
    ['Service Test', 999]
  );
  testServiceId = serviceResult.insertId;
});

afterAll(async () => {
  try {
    const conn = getConnection();
    await conn.query("DELETE FROM manage WHERE employee_id IN (SELECT id FROM employees WHERE email='didier.test@test.com')");
    await conn.query("DELETE FROM employees WHERE email='didier.test@test.com'");
    await conn.query("DELETE FROM services WHERE name='Service Test'");
  } finally {
    await closeConnection();
  }
});

describe('Gestion des employés', () => {
  test('Devrait créer un nouvel employé', async () => {
    const newEmployee = {
      first_name: 'Didier',
      last_name: 'Test',
      email: 'didier.test@test.com',
      salary: 30000,
      service_id: testServiceId
    };

    const result = await scriptManager.addEmployee(newEmployee);
    expect(result).toBeDefined();
    expect(result.first_name).toBe('Didier');
    expect(result.email).toBe('didier.test@test.com');
    expect(result.service_name).toBe('Service Test');
    expect(result.start_date).toBeDefined();

    newEmployeeId = result.id;
  });

  test('Devrait récupérer un employé par son ID', async () => {
    const employee = await scriptManager.getEmployeeById(newEmployeeId);
    expect(employee).toBeDefined();
    expect(employee.email).toBe('didier.test@test.com');
  });

  test('Devrait mettre à jour un employé', async () => {
    const updatedDetails = {
      first_name: 'Didier',
      last_name: 'TestModifié',
      email: 'didier.test@test.com',
      salary: 35000,
      service_id: testServiceId
    };

    const result = await scriptManager.updateEmployee(newEmployeeId, updatedDetails);
    expect(result).toBeDefined();
    expect(result.last_name).toBe('TestModifié');
    expect(parseFloat(result.salary)).toBe(35000);
  });

  test('Devrait trouver des employés par service', async () => {
    const employees = await scriptManager.getEmployeeByService('Service Test');
    expect(Array.isArray(employees)).toBe(true);
    expect(employees.length).toBeGreaterThan(0);
    expect(employees[0].email).toBe('didier.test@test.com');
  });

  test('Devrait retourner null pour un employé invalide', async () => {
    const invalidEmployee = {
      first_name: 'Test'
    };
    const result = await scriptManager.addEmployee(invalidEmployee);
    expect(result).toBeNull();
  });
});
