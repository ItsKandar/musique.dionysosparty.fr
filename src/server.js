const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite database
// Check if the database exists
const fs = require('fs');
const dbFile = './tracks.db';
const dbExists = fs.existsSync(dbFile);

// Create a new database if it doesn't exist
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Delete table if it exists
// db.serialize(() => {
//   db.run('DROP TABLE IF EXISTS users');
// });

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tracks (
    id TEXT, 
    name TEXT, 
    artist TEXT, 
    album TEXT, 
    url TEXT, 
    image TEXT, 
    status TEXT, 
    submitterid TEXT, 
    deleted BOOLEAN
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    is_admin BOOLEAN
)`);
});

// Database pour les musiques
// Endpoint to save track
app.post('/api/tracks', (req, res) => {
  const { id, name, artist, album, url, image , status, submitterid, deleted} = req.body;
  const sql = 'INSERT INTO tracks (id, name, artist, album, url, image, status, submitterid, deleted) VALUES (?, ?, ?, ?, ?, ?, "En attente", ?, false)';
  db.run(sql, [id, name, artist, album, url, image, status, submitterid, deleted], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Track saved successfully' });
    console.log(`Track saved: ${id} - ${name} by ${artist} in ${album} url ${url} and image ${image} current status ${status} deleted ${deleted} submitted by ${submitterid}`);
  });
});

// Endpoint to retrieve saved tracks
app.get('/api/tracks', (req, res) => {
  const sql = 'SELECT * FROM tracks';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ tracks: rows });
  });
});

// Endpoint to approve track
app.post('/api/approve', (req, res) => {
  const { id } = req.body;
  const sql = 'UPDATE tracks SET status = "Approuvé" WHERE id = ?';
  db.run(sql, id, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Track approved successfully' });
    console.log(`Track approved: ${id}`);
  });
});

// Endpoint to reject track
app.post('/api/reject', (req, res) => {
  const { id } = req.body;
  const sql = 'UPDATE tracks SET status = "Rejeté" WHERE id = ?';
  db.run(sql, id, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Track rejected successfully' });
    console.log(`Track rejected: ${id}`);
  });
});

// Endpoint to delete track
app.post('/api/delete', (req, res) => {
  const { id } = req.body;
  const sql = 'DELETE FROM tracks WHERE id = ?';
  db.run(sql, id, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Track deleted successfully' });
    console.log(`Track deleted: ${id}`);
  });
});

// User database
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretkey';

// User registration
app.post('/api/register', async (req, res) => {
    const { username, password , is_admin} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password, is_admin) VALUES (?, ?, 0)';
    
    db.run(sql, [username, hashedPassword, is_admin], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'User registered successfully' });
    });
});

// User login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    
    db.get(sql, [username], async (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row || !(await bcrypt.compare(password, row.password))) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: row.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Middleware to verify token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
  });
}

// Protect the tracks endpoint
app.post('/api/tracks', authenticateToken, (req, res) => {
  const { id, name, artist, album, url, image , status, submitterid, deleted} = req.body;
  const sql = 'INSERT INTO tracks (id, name, artist, album, url, image, status, submitterid, deleted) VALUES (?, ?, ?, ?, ?, ?, "En attente", ?, false)';
  db.run(sql, [id, name, artist, album, url, image, status, submitterid, deleted], (err) => {
      if (err) {
          return res.status(400).json({ error: err.message });
      }
      res.json({ message: 'Track saved successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});