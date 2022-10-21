require('dotenv').config()
const inquirer = require('inquirer');
const express = require('express');
const cTable = require('console.table');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  },
);
// not sure about this ask TA

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
    if(answers.toDoNext == 'view all departments') {
      viewAllDepartments();
    } else if (answers.toDoNext =='view all roles') {
      viewAllRoles();
    } else if (answers.toDoNext =='view all employees') {
      viewAllEmployees();
    } else if (answers.toDoNext == 'add a department') {
      addDepartment();
    } else if (answers.toDoNext == 'add a role') {
      addRole();
    } else if (answers.toDoNext == "add an employee") {
      addEmployee();
    } else if (answers.toDoNext == "update an employee role") {
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
      name: 'name',
      message: 'Enter department name'
    }
  ]).then(function(answers){
      db.query('INSERT INTO department VALUES (DEFAULT, ?'), [answers.name], function(err) {
          if(err) throw(err);
          console.log("Department" + answers.name + "was added to the list");
      };
    });
  };

//ADD ROLE
function addRole() {
  inquirer.prompt ([
    {
      type:'input',
      name: 'title',
      message: 'Enter role name'
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter salary'
    },
    {
      type: 'list',
      name: 'name',
      message: 'Select department name from list',
      choices: ['Sales','Engineering','Finance','Legal']
    }
  ]).then(function(answers) {
    db.query('INSERT INTO role SET ?', [])
  })

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