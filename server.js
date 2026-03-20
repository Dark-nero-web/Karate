const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
// Need larger limit for base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static HTML files from the same directory
app.use(express.static(path.join(__dirname)));

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Database opening error: ", err);
});

// Database tables initialization
db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT,
        phone TEXT,
        country TEXT,
        password TEXT,
        profileImage TEXT
    )`);

    // Create messages table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Registration Endpoint
app.post('/api/register', (req, res) => {
    const { username, email, phone, country, password } = req.body;
    db.run(
        `INSERT INTO users (username, email, phone, country, password) VALUES (?, ?, ?, ?, ?)`,
        [username, email, phone, country, password],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed") || err.message.includes("UNIQUE constraint")) {
                    return res.status(400).json({ error: "Username already exists!" });
                }
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ success: true, message: "User registered successfully" });
        }
    );
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(401).json({ error: "Invalid username or password" });
        
        // Remove password before sending
        const { password: _, ...userData } = row;
        res.json({ success: true, user: userData });
    });
});

// Get Profile Endpoint
app.get('/api/profile/:username', (req, res) => {
    db.get(`SELECT * FROM users WHERE username = ?`, [req.params.username], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(404).json({ error: "User not found" });
        const { password: _, ...userData } = row;
        res.json({ success: true, user: userData });
    });
});

// Admin Get All Users Endpoint
app.get('/api/admin/users', (req, res) => {
    db.all(`SELECT id, username, email, phone, country FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true, users: rows });
    });
});

// Contact Us Form Submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    db.run(
        `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`,
        [name, email, message],
        function(err) {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ success: true, message: "Your message was sent to the Admin account!" });
        }
    );
});

// Admin Get All Messages (Inbox)
app.get('/api/admin/messages', (req, res) => {
    db.all(`SELECT id, name, email, message, created_at FROM messages ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true, messages: rows });
    });
});

// Update Avatar Endpoint
app.post('/api/profile/:username/avatar', (req, res) => {
    const { profileImage } = req.body;
    db.run(`UPDATE users SET profileImage = ? WHERE username = ?`, [profileImage, req.params.username], function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true, message: "Avatar updated" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} `);
});
