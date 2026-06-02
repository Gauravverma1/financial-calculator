const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const SECRET = 'your_jwt_secret';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite DB
let dbPath = './users.db';
if (process.env.VERCEL) {
  dbPath = '/tmp/users.db';
} else if (fs.existsSync('/opt/pocketwise-data')) {
  dbPath = '/opt/pocketwise-data/users.db';
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('DB connection error:', err);
  console.log(`Connected to SQLite database at ${dbPath}.`);
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// Register endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required.' });
  }
  const hash = bcrypt.hashSync(password, 10);
  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hash],
    function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(409).json({ message: 'Username already exists.' });
        }
        return res.status(500).json({ message: 'Database error.' });
      }
      res.status(201).json({ message: 'User registered successfully.' });
    }
  );
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required.' });
  }
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Serve static files from the React/Vite app
const frontendBuildPath = path.join(__dirname, '../../pocket-wise-decisions-main/dist');
app.use(express.static(frontendBuildPath));

// Fallback wildcard route to serve frontend index.html for client-side routing
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
