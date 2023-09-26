const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library
const app = express();
const PORT = 8080;
const jwtkey = "samrudhi";
const jwtExpirySeconds = 3000;



app.use(cors())
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.use('/home', (req, res) => {
    console.log('Handling /home request');
    res.json({ message: "Hi this is done" });
});


/* Inserting values with database. */
app.post('/insertEmployee', (req, res) => {
    const employeeData = req.body;
    console.log("Working")
    const sql = 'INSERT INTO employee (first_name, last_name, contact, email, dob, address) VALUES (?, ?, ?, ?, ?, ?);';
    const values = [
        employeeData.first_name,
        employeeData.last_name,
        employeeData.contact,
        employeeData.email,
        employeeData.dob,
        employeeData.address
    ];
    connection.query(sql, values, (error, result) => {
        if (error) {
            console.error('Error inserting employee:', error);
            res.status(500).json({ error: 'Error inserting employee' });
        } else {
            console.log('Employee inserted successfully');
            res.status(200).json({ message: 'Employee inserted successfully' });
        }
    });
});

/*values from database. */
app.get('/selectEmployee', (req, res) => {
    const sql = 'SELECT * FROM EMPLOYEE';
    connection.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing SELECT query:', error);
            res.status(500).json({ error: 'Error executing SELECT query' });
        } else {
            res.status(200).json(result);
            console.log('Query results:', result);
            for (const row of result) {
                console.log('Employee:', row);
            }
        }
    });
});

app.post('/signin', (req, res) => {
    const loginUser = req.body;
    const sql = 'SELECT id FROM EMPLOYEE where first_name=? and dob=?';
    const values = [
        loginUser.first_name,
        loginUser.dob
    ];
    connection.query(sql, values, (error, result) => {
        if (error) {
            console.error('Error executing sign in process:', error);
            res.status(500).json({ error: 'Error executing sign in process' });
        } else {
            console.log(result)
            if (result.length > 0) {
                // Generate a JWT token
                const user = { id: result[0].id, first_name: loginUser.first_name };
                const token = jwt.sign(user, jwtkey, { expiresIn: jwtExpirySeconds });
                
                res.status(200).json({ id: result[0].id, token, message: 'Employee Found!' });
            } else {
                res.status(404).json({ error: 'Employee Not Found!' });
            }
            console.log('Query results:', result);
            for (const row of result) {
                console.log('Employee:', row);
            }
        }
    });
});
//new added
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }
    jwt.verify(token, jwtkey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }
        req.userId = decoded.id; // Store user ID in the request for later use
        next();
    });
};

// Example usage:
app.get('/protectedEndpoint', verifyToken, (req, res) => {
    // This endpoint is protected and requires a valid JWT token
    // The user ID is available as req.userId
    res.json({ message: 'This is a protected endpoint', userId: req.userId });
});
//new added

/* Getting values within database to display. */
app.get('/getEmployee/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'Select * from employee where id=?';
    connection.query(sql, id, (error, result) => {
        if (error) {
            console.error('Error executing getting data query:', error);
            res.status(500).json({ error: 'Error getting data event' });
        } else {
            res.status(200).json(result);
            console.log('Query results:', result);
            for (const row of result) {
                console.log('Employee:', row);
            }
        }
    });

});


/* Updating values within database. */
app.put('/updateEmployee/:id', (req, res) => {
    const id = req.params.id;
    const employeeData = req.body;
    const sql = 'Update employee set first_name=?, last_name=?, contact=?, email=?, address=? where id=?;';
    const values = [
        employeeData.first_name,
        employeeData.last_name,
        employeeData.contact,
        employeeData.email,
        employeeData.address,
        id
    ];
    connection.query(sql, values, (error, result) => {
        if (error) {
            console.error('Error executing UPDATE query:', error);
            res.status(500).json({ error: 'Error updating event' });
        } else {
            const rowsUpdated = result.affectedRows;
            console.log('Rows updated:', rowsUpdated);
            res.status(200).json({ message: `Updated ${rowsUpdated} rows` });
        }
    });
});

/* Deleting values from database. */
app.delete('/deleteEmployee/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'delete from employee where id=?';
    connection.query(sql, id, (error, result) => {
        if(error){
            console.error('Error executing DELETE query:', error);
            res.status(500).json({ error: 'Error deleting event' });
        } else {
            console.log('Employee deleted successfully');
            res.status(200).json({ message: 'Employee deleted successfully' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});