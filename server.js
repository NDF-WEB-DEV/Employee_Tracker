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
    user: 'root',
    password: 'Gold2022##',
    database: 'hr_db'
  },
);

//confirm connection
db.connect(function(error) {
  if(error) {
    throw error;
  } else {
    console.log(`Connected to the Human Resources database.`)
  }
});

// Welcome message
console.log("<><><><> WELCOME TO THE EMPLOYEE MANAGER <><><><>");

// Start Questionaire
const questions = () => {
  const answers = inquirer.prompt([
    {
      type: 'list',
      name: 'toDonext',
      message: 'What would you like to do?',
      choices: ['view all departments','view all roles','view all employees','add a department','add a role','add an employee','update an employee role']
    }
    
  ])
  if(answers.toDoNext === 'view all departments') {
    db.query('SELECT * FROM departments', function (err, results) {
      console.log(results);
    }); 
  } else if (answers.toDoNext ==='view all roles') {
    db.query('SELECT * FROM role', function (err, results) {
      console.log(results);
    });
  } else if (answers.toDoNext ==='view all employees') {
    db.query('SELECT * FROM employee', function (err, results) {
      console.log(results);
    });
}


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

//port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
};