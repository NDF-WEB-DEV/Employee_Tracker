const inquirer = require('inquirer');
const express = require('express');
const cTable = require('console.table');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Gold2022##',
    database: 'hr_db'
  },
);
// not sure about this ask TA
process.env.DATABASE, 
process.env.USERNAME, 
process.env.PASSWORD,

//confirm connection
db.connect(function(error) {
  if(error) {
    throw error;
  } else {
    console.log(`Connected to the Human Resources database.`)
  }

console.log("<><><><> WELCOME TO THE EMPLOYEE MANAGER <><><><>");
//INQUIRER QUESTIONS START HERE
const answers = inquirer.prompt([
  {
    type: 'list',
    name: 'toDoNext',
    message: 'What would you like to do?',
    choices: ['view all departments','view all roles','view all employees','add a department','add a role','add an employee','update an employee role']
  } 
  ]).then(answers); {
    if(answers == 'view all departments') {
      viewAllDepartments();
    } else if (answers =='view all roles') {
      viewAllRoles();
    } else if (answers =='view all employees') {
      viewAllEmployees();
    } else if (answers == 'add a department') {
      addDepartment();
    } else if (answers == 'add a role') {
      addRole();
    } else if (answers == "add an employee") {
      addEmployee();
    } else if (answers == "update an employee role") {
      updateEmployee();
    }
  };

  //VIEW ALL DEPARTMENTS
function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
      if(err) throw err;
      console.table(results);
  });
};

//VIEW ALL ROLES
function viewAllRoles(){
    db.query('SELECT * FROM role', function (err, results) {
      if(err) throw(err);
      console.table(results);
  });
};

//VIEW ALL EMPLOYEES
function viewAllEmployees() {
  db.query('SELECT * FROM employee', function (err, results) {
    if(err) throw(err);
    console.table(results);
  });
};

// ADD DEPARTMENT
function addDepartment() {
  inquirer.prompt ([
    {
      type: 'input',
      name: 'department',
      message: 'Please enter the name of the department'
    }
  ]).then(function(answers){
      db.query('INSERT INTO department VALUES (DEFAULT, ?'), [answers.department], function(err) {
          if(err) throw(err);
          console.log("Department" + answers.department + "was added to the list");
      }
    });
  };

//ADD ROLE
function addRole() {

};

//ADD EMPLOYEE
function addEmployee() {

};

//UPDATE EMPLOYEE
function updateEmployee() {
  
}






// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

//port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});