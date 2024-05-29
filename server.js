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
    const sql = 'SELECT * FROM employee WHERE status ="Active"';
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
    const username = req.body.username;
    const password = req.body.password;
    
    const checkUsernameSql = "SELECT * FROM employee WHERE username = ?";
    db.query(checkUsernameSql, [username], (err, userData) => {
        if (err) {
            return res.json("Error");
        }
        if (userData.length === 0) {
            return res.json("no_user");
        }
        const user = userData[0];
        
        if (user.status === 'inactive') {
            return res.json("You are no longer allowed to access");
        }

        if (user.classification === 'admin') {
            return res.json({ status: "success", isAdmin: true });
        } else {
            const checkPasswordSql = "SELECT * FROM employee WHERE username = ? AND password = ?";
            db.query(checkPasswordSql, [username, password], (err, data) => {
                if (err) {
                    return res.json("Error");
                }
                if (data.length > 0) {
                    return res.json({ status: "success", isAdmin: false });
                } else {
                    return res.json("wrong_password");
                }
            });
        }
    });
});


app.post('/addEmployee', (req, res) => {
    const { name, phno, email, age, salary, country, addedby,username,password,classification } = req.body;
    const sql = "INSERT INTO employee (name, phno, email, age, salary, country, addedby,username,password,classification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, phno, email, age, salary, country, addedby, username,password,classification], (err, result) => {
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
    const { name, phno, email, age, salary, country,classification } = req.body;
    const sql = "UPDATE employee SET name = ?, phno  = ?, email = ?, age = ?, salary = ?, country = ?,classification = ? WHERE id = ?";
    db.query(sql, [name, phno , email, age, salary, country,classification, id], (err, result) => {
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
    const sql = 'UPDATE employee SET status = "inactive" Where id = ?';
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

// Signup route
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error('Error signing up:', err);
            return res.status(500).json({ message: 'Error signing up' });
        }
        res.status(200).json({ message: 'Signup successful', data: result });
    });
});


app.get('/activeEmployees', (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM employee WHERE status = "Active"';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching active employees:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(result[0].count); // Send the count of active employees
    });
});

// Route to get the number of inactive employees
app.get('/inactiveEmployees', (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM employee WHERE status = "Inactive"';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching inactive employees:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(result[0].count); // Send the count of inactive employees
    });
});
app.get('/profile/:username', (req, res) => {
    const { username } = req.params;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result[0]); // Send the user data as JSON response
    });
});


// Route to get the number of logged-in users
app.get('/loggedInUsers', (req, res) => {
    // Implement logic to get the count of logged-in users from your authentication system
    // This could involve querying a session store or database
    // For demonstration purposes, we'll assume a static value of 10 for now
    const loggedInUsersCount = 10;
    res.json(loggedInUsersCount); // Send the count of logged-in users
});
// Example Node.js/Express endpoint
app.get('/employee/events', (req, res) => {
    const employeeId = req.user.id; // assuming you have user info in req.user

    const events = [
        // Mock data - replace with actual database queries
        { id: 1, name: 'Event 1', date: '2024-06-01', documentsMissing: false },
        { id: 2, name: 'Event 2', date: '2024-06-15', documentsMissing: true },
        // Add more events as needed
    ];

    const collaborations = [
        // Mock data - replace with actual database queries
        { id: 1, eventName: 'Event 1', collaboratorName: 'John Doe' },
        // Add more collaborations as needed
    ];

    res.json({
        events,
        totalEvents: events.length,
        collaborations
    });
});


app.listen(8081, () => {
    console.log("Server is running on http://localhost:8081");
});