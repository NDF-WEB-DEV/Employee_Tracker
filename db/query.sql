-- DB --
SELECT hr_db;

-- View All Departments TABLE --
SELECT * FROM department;

-- ROLES TABLES --
-- View Roles TABLE --
SELECT * FROM role;

-- View All Roles and include department name --
SELECT role.id, role.title, department.name, role.salary
FROM role, department
WHERE role.department_id=department.id;

-- EMPLOYEE TABLES --
-- View Employee TABLE --
SELECT * FROM employee;

-- View All Employees and include manager column --
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, 
CONCAT(manager.first_name, ' ', manager.last_name) -- concatenate two col to create a manager column 
AS manager FROM employee -- create temp table manager from the employee table
LEFT JOIN employee manager ON manager.id = employee.manager_id -- connect manager temp table to the employee table
INNER JOIN role ON role.id = employee.role_id -- connect role and employee table
INNER JOIN department ON department.id = role.department_id  -- connetc department table to the role table
ORDER BY employee.id; -- order by id number

-- View Employee list with Managers
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM employee 
JOIN employee manager ON manager.id = employee.manager_id 
JOIN role ON role.id = employee.role_id 
JOIN department ON department.id = role.department_id 
ORDER BY employee.id;

-- Add a Department
BEGIN;
INSERT INTO department (name)
VALUES
    ('Information Technology');
SELECT * FROM department;
COMMIT;
END;

-- Add a Role --
BEGIN;
INSERT INTO role (title, salary, department_id)
VALUES 
    ('Cloud Administrator', 90000, 5);
SELECT * FROM role;
COMMIT;
END;

-- Add a Role to the Roles TABLE --
BEGIN;
INSERT INTO role (title, salary)
    VALUES('Junior Developer', 85000, 6);
INSERT INTO department (name)
    VALUES('Engineering');
COMMIT;
END;

-- Add an employee --
BEGIN;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Michael', 'Robinson', 5, null);
SELECT * FROM employee;
COMMIT;
END;

-- Update an employee role --
BEGIN;
INSERT INTO role (name)
VALUES
    ('CTO');
SELECT * FROM role;
COMMIT;

UPDATE employee
SET title = 'CTO', role_id = 5
WHERE last_name='Robinson'
COMMIT;

SELECT * FROM employee
COMMIT;
END;

UPDATE employee
JOIN role ON employee.role_id = role.id 

-- See TABLE structure --
DESCRIBE department;
DESCRIBE role;
DESCRIBE employee;
