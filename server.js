const express = require("express");
const mysql = require("mysql2");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sharon@123",
    database: "sakila"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Fetch all employees
app.get('/viewEmployee', (req, res) => {
    const sql = 'SELECT * FROM employee';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return res.status(500).json({ message: 'Error fetching employees' });
        }
        res.status(200).json(result);
    });
});

// Fetch employee details by ID
app.get('/updateEmployee/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM employee WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching employee:', err);
            return res.status(500).json({ message: 'Error fetching employee' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(result[0]);
    });
});
app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (name, email, password) VALUES ?";
    const values = [[req.body.name, req.body.email, req.body.password]];
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const checkEmailSql = "SELECT * FROM login WHERE email = ?";
    db.query(checkEmailSql, [email], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length === 0) {
            return res.json("no_user");
        }
        const checkPasswordSql = "SELECT * FROM login WHERE email = ? AND password = ?";
        db.query(checkPasswordSql, [email, password], (err, data) => {
            if (err) {
                return res.json("Error");
            }
            if (data.length > 0) {
                return res.json("success");
            } else {
                return res.json("wrong_password");
            }
        });
    });
});
app.post('/addEmployee', (req, res) => {
    const { name, ph, email, age, salary, country, added_by } = req.body;
    const sql = "INSERT INTO employee (name, ph, email, age, salary, country, added_by) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, ph, email, age, salary, country, added_by], (err, result) => {
        if (err) {
            console.error('Error inserting data into employee table:', err);
            return res.status(500).json({ message: 'Error adding employee' });
        }
        res.status(200).json({ message: 'Employee added successfully', data: result });
    });
});
// Update employee details by ID
app.put('/updateEmployee/:id', (req, res) => {
    const { id } = req.params;
    const { name, ph, email, age, salary, country } = req.body;
    const sql = "UPDATE employee SET name = ?, ph = ?, email = ?, age = ?, salary = ?, country = ? WHERE id = ?";
    db.query(sql, [name, ph, email, age, salary, country, id], (err, result) => {
        if (err) {
            console.error('Error updating employee:', err);
            return res.status(500).json({ message: 'Error updating employee' });
        }
        res.status(200).json({ message: 'Employee updated successfully', data: result });
    });
});

// Delete employee by ID
app.delete('/deleteEmployee/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM employee WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting employee:', err);
            return res.status(500).json({ message: 'Error deleting employee' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully', data: result });
    });
});

// Other routes (e.g., login, signup, add employee) go here...

app.listen(8081, () => {
    console.log("Server is running on http://localhost:8081");
});
