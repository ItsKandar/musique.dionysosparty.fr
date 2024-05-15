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

// Create table
db.run('CREATE TABLE tracks(id TEXT, name TEXT, artist TEXT, album TEXT, url TEXT, image TEXT)');

// Endpoint to save track
app.post('/api/tracks', (req, res) => {
  const { id, name, artist, album, url, image } = req.body;
  const sql = 'INSERT INTO tracks (id, name, artist, album, url, image) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [id, name, artist, album, url, image], (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Track saved successfully' });
    console.log(`Track saved: ${name} by ${artist} in ${album} url ${url} and image ${image}`);
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});