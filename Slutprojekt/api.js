const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// Connect to MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'my-app-db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

// Define User schema
const userSchema = {
  id: { type: Number, primary: true, autoIncrement: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

// Hash password before saving to database
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// Compare password with hash
const comparePassword = async (candidatePassword, hash) => {
  const match = await bcrypt.compare(candidatePassword, hash);
  return match;
};

// Define routes
app.get('/', (req, res) => {
  res.send('Documentation');
});

app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const newUser = { username, password: hashedPassword };
  const query = `INSERT INTO users SET?`;
  connection.query(query, newUser, (err, results) => {
    if (err) throw err;
    res.status(201).send(results);
  });
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM users WHERE id =?`;
  connection.query(query, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.status(404).send('User not found');
    res.send(results[0]);
  });
});

app.get('/users', (req, res) => {
  const query = `SELECT * FROM users`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const updatedUser = { username, password: hashedPassword };
  const query = `UPDATE users SET? WHERE id =?`;
  connection.query(query, [updatedUser, id], (err, results) => {
    if (err) throw err;
    if (results.affectedRows === 0) return res.status(404).send('User not found');
    res.send(updatedUser);
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username =?`;
  connection.query(query, [username], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.status(404).send('User not found');
    const user = results[0];
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) return res.status(401).send('Invalid password');
    const token = jwt.sign({ id: user.id }, 'secret_key', {
      expiresIn: '1h',
    });
    res.send({ token });
  });
});

// Protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});