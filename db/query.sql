-- View roles TABLE
SELECT * FROM role;

-- View Employee TABLE
SELECT * FROM employee;

-- View Departments TABLE
SELECT * FROM department;

-- Add a Role to the Roles TABLE
BEGIN;
INSERT INTO role (title, salary)
    VALUES('Junior Developer','85000');
INSERT INTO department (name)
    VALUES('Engineering');
COMMIT;
END;

