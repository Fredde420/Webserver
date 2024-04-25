const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'slutprojekt',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

const userSchema = {
  id: { type: Number, primary: true, autoIncrement: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const comparePassword = async (candidatePassword, hash) => {
  const match = await bcrypt.compare(candidatePassword, hash);
  return match;
};

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.post('/users', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await hashPassword(password);
  const newUser = { username, password: hashedPassword, email };
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
  const { username, password, email } = req.body;
  const hashedPassword = await hashPassword(password);
  const updatedUser = { username, password: hashedPassword, email };
  const query = `UPDATE users SET? WHERE id =?`;
  connection.query(query, [updatedUser, id], (err, results) => {
    if (err) throw err;
    if (results.affectedRows === 0) return res.status(404).send('User not found');
    res.send(updatedUser);
  });
});

app.post('/login', async (req, res) => {
  const { username, password, email } = req.body;
  const query = `SELECT * FROM users WHERE username =? AND email =?`;
  connection.query(query, [username, email], async (err, results) => {
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