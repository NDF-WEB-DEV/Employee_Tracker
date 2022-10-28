require('dotenv').config()  // package to secure credentials
const inquirer = require('inquirer'); // package for cli prompt
const express = require('express'); // package for express.js
const cTable = require('console.table'); // package to print formatted queries
const mysql = require('mysql2'); // mysql package for node.js
const PORT = process.env.PORT || 3001;  // alternative port connection
const app = express();  // node.js web application framework

// Express middleware
app.use(express.urlencoded({ extended: false }));  //parses incoming requests with urlencoded payloads
app.use(express.json());  // parses incoming requests with JSON payloads

// Connection to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true      //added to be able to pass multiple statemsnt in query param
  },
);

//confirming connection
db.connect(function(error) {
  if(error) {
    throw error;
  } else {
    console.log(`Connected to the Human Resources database.`)
    hrApp();
  }
});

//APP STARTS HERE - INQUIRER QUESTIONS
function hrApp() {
  console.log("<><><><> WELCOME TO THE EMPLOYEE MANAGER <><><><>");
  inquirer
    .prompt([
    {
      type: 'list',
      name: 'toDoNext',
      message: 'What would you like to do?',
      choices: ['view all departments','view all roles','view all employees','add department','add role','add employee','update employee role']
    }
    ]).then(answers => {  //User selects the action they want take in this function
      if(answers.toDoNext == 'view all departments') {
        viewAllDepartments();
      } else if (answers.toDoNext =='view all roles') {
        viewAllRoles();
      } else if (answers.toDoNext =='view all employees') {
        viewAllEmployees();
      } else if (answers.toDoNext == 'add department') {
        addDepartment();
      } else if (answers.toDoNext == 'add role') {
        addRole();
      } else if (answers.toDoNext == 'add employee') {
        addEmployee();
      } else if (answers.toDoNext == 'update employee role') {
        updateEmployee();
      } else {
        process.exit(true);
      }
    });
};

//VIEW ALL DEPARTMENTS
function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
      if(err) throw err;  // Prints errors if true
      console.table(results); // prints results of query
      hrApp();  // calling main app to continue application interaction
  });
};

//VIEW ALL ROLES
function viewAllRoles(){  //Query to view the 'Roles Table' as assignment video 
    db.query('SELECT role.id, role.title, department.name, role.salary FROM role, department WHERE role.department_id=department.id', function (err, results) {  
      if(err) throw err;  // Prints erros if true
      console.table(results); // prints results of query
      hrApp();  // calling main app to continue application interaction
  });
};

//VIEW ALL EMPLOYEES
// Query to view 'Employee Table' as assignment video
function viewAllEmployees(){
  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id ORDER BY employee.id;', function (err, results) { 
    if(err) throw err;  // Prints erros if true
    console.table(results); // prints results of query
    hrApp();  // calling main app to continue application interaction
  });
};

// ADD DEPARTMENT
function addDepartment(){
    inquirer
      .prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the department?'
    }
  ]).then(function(answers){  //query to insert a new department into the 'Dept. Table'
      db.query('INSERT INTO department VALUES (DEFAULT, ?)',(answers.name), function(err){  
        if(err) throw err;  // Prints errors if true
        console.log("Added " + answers.name + "to the database");  // printing confirmation
      });
      db.query('SELECT * FROM department', function (err, results) {
        if(err) throw err;  // Prints erros if true
        console.table(results); // prints results of query
        hrApp();  // calling main app to continue application interaction
      });
    });
  };
  
//ADD ROLE
function addRole() {
  db.query('SELECT name FROM department', function (err, results) {
    if(err) throw(err);
  inquirer
  .prompt ([
    {
      type:'input',
      name: 'title',
      message: 'What is the name of the role?'
    },
    {
      type: 'number',
      name: 'salary',
      message: 'What is the salary of the role?'
    },
    {
      type: 'rawlist',
      name: 'name',
      message: 'Which department does the role belong to?',
      choices:     // INQUIRER docs -> allows for loops while using rawlist
        function() {    // Added the for loop to traverse the list to include the latest roles, it was not worrking with the array.
          let deptChoices = [];
          for(i = 0; i < results.length; i++) {
            deptChoices.push(results[i].name)
          };
          return deptChoices;
        }
    },
    {
      type: 'number',
      name: 'department_id',
      message: 'Enter a department ID'
    }
  ]).then(function(answers) {
    db.query('INSERT INTO role VALUES (DEFAULT, ?,?,?)', [answers.title, answers.salary, answers.department_id]), (err, results)=> {
      if(err) throw(err);
    };
    db.query('SELECT * FROM role', function (err, results) {
      if(err) throw err;  // Prints errors if true
      console.table(results); // prints results of query
      console.log("Role" + answers.title + "was added to the list");
      hrApp();
    });
  });
});
};
//ADD EMPLOYEE
function addEmployee() {
  db.query('SELECT title FROM role', function (err, results) {
    if(err) throw(err);
  db.query('SELECT CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN employee manager ON manager.id = employee.manager_id JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id ORDER BY employee.id', function (err, results2) {
      if(err) throw(err);
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter first name'
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter last name'
    },
    {
      type: 'rawlist',
      name: 'title',
      message: 'Select role from list',
      choices:     // INQUIRER docs -> allows for loops while using rawlist
        function() {    // Added the for loop to traverse the list to include the latest roles, it was not worrking with the array.
          let titleChoices = [];
          for(i = 0; i < results.length; i++) {
            titleChoices.push(results[i].title)
          };
          return titleChoices;
        }
    },
    {
      type: 'rawlist',
      name: 'manager',
      message: 'Who is the employees manager?',
      choices: 
        function() {
          let managerChoices = [];
          for(i = 0; i < results2.length; i++) {
            managerChoices.push(results2[i].manager)
          };
          return managerChoices;
        }
    }
  ]).then(function(answers) {
      //insert query that collects info to add employee
      db.query('INSERT INTO employee SET (DEFAULT,?,?,?,?)', [answers.first_name, answers.last_name, answers.title, answers.manager_id]), (err, results) => {
        if(err) throw(err);
      };
      db.query('SELECT * FROM employee', function (err, results) {
        if(err) throw err;  // Prints errors if true
        console.table(results); // prints results of query
        console.log("Employee" + answers.first_name + answers.last_name + "was added to the list");
        hrApp();
      });
    });
  });
  });
}
  
//UPDATE EMPLOYEE
function updateEmployee() {
  db.query('SELECT * FROM employee', function (err, results){
  inquirer
    .prompt([
      {
        name: 'empChoice',
        type: 'rawlist',
        choices: 
          function(){  
            let employeeStorage = [];
              for(i =0; i < results.length; i++) {  // Travesing the list of employees
                employeeStorage.push(results[i].last_name);
              }
              return employeeStorage;  
          },
        message: 'Choose the employee to update'
      }
    ]).then(function(answers) {
        const empSelected = answers.empChoice;  // declaring variable to store selected employee
        db.query('SELECT * FROM employees', function(err, results) {  // Query to view the whole employee table
          inquirer
            .prompt([
              {
                type: 'rawlist',
                name: 'title',
                choices: 
                function() {
                  let titleChoices = [];
                  for(i = 0; i< results.length; i++) {  // Travesing the list of titles
                    titleChoices.push(results[i].role_id)
                  };
                  return titleChoices;
                },
                message: 'Which role do you want to assign the selected employee?'
              },
              {
                type: 'number',
                name: 'manager_id',
                message: 'Enter the employee new manager ID',
                default: "1"
              }
            ]).then(function(answers){  // Updating the employee title
              db.query('UPDATE employee SET ? WHERE last_name = ?', [answers.title, answers.manager_id], empSelected);  
              db.query('SELECT * FROM employee', function (err) {  
                if(err) throw(err);
                console.table(results);  // Printing the employee table to see if change took place
                console.log("Employee " + empSelected + " title was updated");  // confirmation 
                hrApp();
            })
        });
    });
});
});
};

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

//port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});