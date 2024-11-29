import { scriptManager, initConnection, closeConnection } from "./database/database.js";

const main = async () => {
  // Chercher un employé par son ID
  try {
    await initConnection();
    const employees = await scriptManager.getEmployeeById(1);
    console.log(employees);
  } catch (error) {
    console.error('Oupsss :', error.message);
  } finally {
    await closeConnection();
  }

  // Chercher un employé par son service
  try {
    await initConnection();
    const employees = await scriptManager.getEmployeeByService('Fin');
    console.log(employees);
  } catch (error) {
    console.error('Oupsss :', error.message);
  } finally {
    await closeConnection();
  }

  // Ajouter un nouvel employé
  try {
    await initConnection();
    const employee = {
      first_name: 'Didier',
      last_name: 'LeRetour',
      email: 'didier.leretour3@gmail.com',
      salary: 10000,
      service_id: 1
    };
    const newEmployee = await scriptManager.addEmployee(employee);
    console.log('Nouveau Didier créé :');
    console.log('- Nom complet:', newEmployee.first_name, newEmployee.last_name);
    console.log('- Email:', newEmployee.email);
    console.log('- Service:', newEmployee.service_name);
    console.log('- Date de début:', newEmployee.start_date);
  } catch (error) {
    console.error('Oupsss :', error.message);
  } finally {
    await closeConnection();
  }

  // Mettre à jour un employé
  try {
    await initConnection();
    const employee = {
      first_name: 'Didiiiiiiiiier',
      last_name: 'LeRetour',
      email: 'didier.leretour356@gmail.com',
      salary: 10000,
      service_id: 3
    };
    const updatedEmployee = await scriptManager.updateEmployee(1, employee);
    console.log('Didier mis à jour :');
    console.log('- Nom complet:', updatedEmployee.first_name, updatedEmployee.last_name);
    console.log('- Email:', updatedEmployee.email);
    console.log('- Service:', updatedEmployee.service_name);
    console.log('- Date de début:', updatedEmployee.start_date);
  } catch (error) {
    console.error('Oupsss :', error.message);
  } finally {
    await closeConnection();
  }

  // Supprimer un employé
  try {
    await initConnection();
    const deleted = await scriptManager.deleteEmployee(1);
    console.log('Didier supprimé :', deleted);
  } catch (error) {
    console.error('Oupsss :', error.message);
  } finally {
    await closeConnection();
  }

  // Ajouter un nouveau service
  try {
    await initConnection();
    const service = {
      name: 'Service de test',
      office_number: 1234
    };
    const newService = await scriptManager.addService(service.name, service.office_number);
    console.log('Nouveau service créé :', newService);
  } catch (error) {
    console.error('Oupsss :', error.message);
  } finally {
    await closeConnection();
  }

  // Mettre à jour un service
  try {
    await initConnection();
    const service = {
      name: 'Service de test modifié',
      office_number: 5678
    };
    const updatedService = await scriptManager.updateService(1, service.name, service.office_number);
    console.log('Service mis à jour :', updatedService);
  } catch (error) {
    console.error('Oupsss :', error.message);
  } finally {
    await closeConnection();
  }

  // Supprimer un service
  try {
    await initConnection();
    const deleted = await scriptManager.deleteService(1);
    console.log('Service supprimé :', deleted);
  } catch (error) {
    console.error('Oupsss :', error.message);
  } finally {
    await closeConnection();
  }

  // Les procédures et fonctions
  try {
    await initConnection();

    console.log("=== Nombre d'employés par service ===");
    const employeeCount = await scriptManager.employeeCountByService();
    console.table(employeeCount);

    console.log("=== Services et leurs managers ===");
    const managers = await scriptManager.managersServices();
    console.table(managers);

    console.log("=== Plage salariale ===");
    const range = await scriptManager.salaryRange();
    console.log("Plage salariale :", range);

    console.log("=== Top des services par masse salariale ===");
    const topServices = await scriptManager.topServicesBySalary();
    console.table(topServices);

  } catch (error) {
    console.error('Oupsss :', error.message);
  } finally {
    await closeConnection();
  }
}


main();
