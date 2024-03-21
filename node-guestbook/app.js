const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'guest_book',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.get('/api/guestbook', (req, res) => {
  const sql = 'SELECT * FROM guestbook';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/api/guestbook', (req, res) => {
  const { name, email, homepage, comment } = req.body;
  const sql = 'INSERT INTO guestbook (name, email, homepage, comment) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, homepage, comment], (err, result) => {
    if (err) throw err;
    res.send('Guestbook entry added...');
  });
});

app.put('/api/guestbook/:id', (req, res) => {
  const { name, email, homepage, comment } = req.body;
  const sql = 'UPDATE guestbook SET name = ?, email= ?, homepage = ?, comment = ? WHERE id = ?';
  
  db.query(sql, [name, email, homepage, comment, req.params.id], (err, result) => {
    if (err) throw err;
    res.send('Guestbook entry added...');
    
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

