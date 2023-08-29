const mysql = require("mysql2")
const express = require('express')
const  app = express()
const port = 8787;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'task_w_db'
});


connection.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );
`, (err) => {
    if (err) {
        console.error('Error creating users table:', err);
    }
});
app.set('view engine', 'ejs')
app.set('views', './templates')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.render('index', {test:12455 })
})
app.get('/login', (req, res)=>{
    res.render('login')
})
app.get('/register', (req, res)=>{
    res.render('register')
})
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
        console.log(username)
        console.log(password)

    connection.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                res.status(500).send('Error inserting user');
                return;
            }

            console.log('User registered:', username);
            res.send('User registered');
        }
    );
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    connection.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                console.error('Error checking user:', err);
                res.status(500).send('Error checking user');
                return;
            }

            if (results.length === 0) {
                console.log('Authentication failed for:', username);
                res.status(401).send('Authentication failed');
            } else {
                console.log('Authentication successful for:', username);
                res.send('Authentication successful');
            }
        }
    );
});
app.listen(port, ()=>{

})