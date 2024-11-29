# Scripts SQL pour créer la base de données

## Création de la base de données

```SQL
CREATE DATABASE IF NOT EXISTS company;
USE company;
```

## Création des tables [services, employees, manage]

```SQL
CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  office_number INT NOT NULL
);

CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  salary DECIMAL(10,2) NOT NULL,
  service_id INT,
  FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE manage (
  service_id INT,
  employee_id INT,
  start_date DATE NOT NULL,
  PRIMARY KEY (service_id, employee_id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);
```

## Données de test

```SQL
INSERT INTO services (name, office_number) VALUES
('IT Department', 101),
('Human Resources', 202),
('Marketing', 303),
('Finance', 404);

INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES
('John', 'Doe', 'john.doe@company.com', 65000.00, 1),
('Jane', 'Smith', 'jane.smith@company.com', 55000.00, 2),
('Robert', 'Johnson', 'robert.j@company.com', 70000.00, 1),
('Maria', 'Garcia', 'maria.g@company.com', 62000.00, 3),
('James', 'Wilson', 'james.w@company.com', 58000.00, 4);

INSERT INTO manage (service_id, employee_id, start_date) VALUES
(1, 1, '2022-01-01'),
(2, 2, '2022-02-15'),
(3, 4, '2022-03-01'),
(4, 5, '2022-04-01');
```

---
# Requêtes SQL

## Nombre d'employés total

```SQL
SELECT COUNT(*) AS total_employees FROM employees;
```

## Moyenne des salaires de l'entreprise

```SQL
SELECT AVG(salary) AS average_salary FROM employees;
```

## Moyenne des salires par service

```SQL
SELECT name AS service_name, AVG(salary) AS average_salary
FROM employees
JOIN services ON employees.service_id = services.id
GROUP BY name;
```

---
# Procédures stockées

## Le classement du nombre d'employés par service

```SQL
DROP PROCEDURE IF EXISTS employee_count_by_service;
CREATE PROCEDURE employee_count_by_service()
BEGIN
    SELECT
        services.name AS service_name,
        COUNT(DISTINCT manage.employee_id) AS employee_count
    FROM services
    LEFT JOIN manage ON services.id = manage.service_id
    GROUP BY services.id, services.name
    ORDER BY employee_count DESC;
END;

CALL employee_count_by_service();
```

## Top 5 des services par masse salariale

```SQL
DROP PROCEDURE IF EXISTS top_services_by_salary;
CREATE PROCEDURE top_services_by_salary()
BEGIN
    SELECT
        services.name AS service_name,
        SUM(employees.salary) AS total_salary
    FROM services
    LEFT JOIN employees ON services.id = employees.service_id
    GROUP BY services.id, services.name
    ORDER BY total_salary DESC
    LIMIT 5;
END;

CALL top_services_by_salary();
```

## La liste des managers et le service dont ils s'occupent

```SQL
DROP PROCEDURE IF EXISTS managers_services;
CREATE PROCEDURE managers_services()
BEGIN
    SELECT
        employees.first_name,
        employees.last_name,
        services.name AS service_name
    FROM employees
    JOIN manage ON employees.id = manage.employee_id
    JOIN services ON manage.service_id = services.id;
END;

CALL managers_services();
```

---
# Fonctions

## Fonction permettant de trouver l'écart entre le plus gros et le plus petit salaire de l'entreprise

```SQL
DROP FUNCTION IF EXISTS salary_range;
CREATE FUNCTION salary_range()
RETURNS DECIMAL(10,2)
NO SQL
BEGIN
    DECLARE min_salary DECIMAL(10,2);
    DECLARE max_salary DECIMAL(10,2);
    SELECT MIN(salary), MAX(salary) INTO min_salary, max_salary FROM employees;
    RETURN max_salary - min_salary;
END;

SELECT salary_range() AS salary_range;
```
