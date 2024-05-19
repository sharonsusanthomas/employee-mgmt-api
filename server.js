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

app.listen(8081, () => {
    console.log("listening");
});
