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
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

// Create table if it doesn't exist
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS tracks (id TEXT, name TEXT, artist TEXT, album TEXT, url TEXT, image TEXT, status TEXT)');
});
// db.run('CREATE TABLE tracks(id TEXT, name TEXT, artist TEXT, album TEXT, url TEXT, image TEXT, status TEXT)');


// Endpoint to save track
app.post('/api/tracks', (req, res) => {
  const { id, name, artist, album, url, image , status} = req.body;
  const sql = 'INSERT INTO tracks (id, name, artist, album, url, image, status) VALUES (?, ?, ?, ?, ?, ?, "En attente")';
  db.run(sql, [id, name, artist, album, url, image, status], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Track saved successfully' });
    console.log(`Track saved: ${name} by ${artist} in ${album} url ${url} and image ${image} current status ${status}`);
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});