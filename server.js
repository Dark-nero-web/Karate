const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

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
        profileImage TEXT,
        securityQuestion TEXT,
        securityAnswer TEXT
    )`);

    // Add security columns to existing tables (will silently fail if already exists)
    db.run(`ALTER TABLE users ADD COLUMN securityQuestion TEXT`, () => {});
    db.run(`ALTER TABLE users ADD COLUMN securityAnswer TEXT`, () => {});

    // Create messages table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create events table
    db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        event_date TEXT,
        event_type TEXT DEFAULT 'event',
        created_by TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Registration Endpoint
app.post('/api/register', async (req, res) => {
    const { username, email = '', phone = '', country = '', password, securityQuestion = '', securityAnswer = '' } = req.body;
    console.log(`Registration attempt: ${username}`);
    
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedAnswer = securityAnswer ? await bcrypt.hash(securityAnswer.toLowerCase().trim(), 10) : '';
        console.log("Password hashed successfully");
        
        db.run(
            `INSERT INTO users (username, email, phone, country, password, securityQuestion, securityAnswer) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [username, email, phone, country, hashedPassword, securityQuestion, hashedAnswer],
            function (err) {
                if (err) {
                    console.error("Database insert error:", err.message);
                    if (err.message.includes("UNIQUE constraint failed") || err.message.includes("UNIQUE constraint")) {
                        return res.status(400).json({ success: false, message: "Username already exists!" });
                    }
                    return res.status(500).json({ success: false, message: "Database error: " + err.message });
                }
                console.log(`User registered: ${username}`);
                res.json({ success: true, message: "User registered successfully" });
            }
        );
    } catch (e) {
        console.error("Bcrypt hashing error:", e);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (!row) return res.status(401).json({ success: false, message: "Invalid username or password" });
        
        const isMatch = await bcrypt.compare(password, row.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid username or password" });

        // Remove password before sending
        const { password: _, securityAnswer: __, ...userData } = row;
        res.json({ success: true, user: userData });
    });
});

// Get Security Question for Password Reset
app.post('/api/get-security-question', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required" });
    }

    db.get(`SELECT securityQuestion FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (!row) return res.status(404).json({ success: false, message: "User not found" });
        if (!row.securityQuestion) return res.status(400).json({ success: false, message: "No security question set for this account" });
        res.json({ success: true, question: row.securityQuestion });
    });
});

// Password Reset Endpoint
app.post('/api/reset-password', async (req, res) => {
    const { username, securityAnswer, newPassword } = req.body;
    if (!username || !securityAnswer || !newPassword) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    db.get(`SELECT securityAnswer FROM users WHERE username = ?`, [username], async (err, row) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (!row) return res.status(404).json({ success: false, message: "User not found" });
        if (!row.securityAnswer) return res.status(400).json({ success: false, message: "No security question set" });

        try {
            const isMatch = await bcrypt.compare(securityAnswer.toLowerCase().trim(), row.securityAnswer);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Incorrect security answer" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            db.run(`UPDATE users SET password = ? WHERE username = ?`, [hashedPassword, username], function(err) {
                if (err) return res.status(500).json({ success: false, message: "Database error" });
                res.json({ success: true, message: "Password reset successfully! You can now login." });
            });
        } catch (e) {
            res.status(500).json({ success: false, message: "Server error" });
        }
    });
});

// Get Profile Endpoint
app.get('/api/profile/:id', (req, res) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (!row) return res.status(404).json({ success: false, message: "User not found" });
        const { password: _, securityAnswer: __, ...userData } = row;
        res.json({ success: true, user: userData });
    });
});

// Simple Admin Auth Middleware (Placeholder)
const adminAuth = (req, res, next) => {
    const requester = req.headers['x-admin-user'];
    if (requester === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: "Unauthorized access" });
    }
};

// Admin Get All Users Endpoint
app.get('/api/admin/users', adminAuth, (req, res) => {
    db.all(`SELECT id, username, email, phone, country FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, users: rows });
    });
});

// Update Profile Endpoint (Kyu Level)
app.post('/api/profile/:id/update', (req, res) => {
    const { kyu } = req.body;
    db.run(`UPDATE users SET country = ? WHERE id = ?`, [kyu, req.params.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, message: "Profile updated successfully" });
    });
});

// Update Avatar Endpoint
app.post('/api/profile/:id/avatar', (req, res) => {
    const { profileImage } = req.body;
    db.run(`UPDATE users SET profileImage = ? WHERE id = ?`, [profileImage, req.params.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, message: "Avatar updated" });
    });
});

// Unify contact endpoint to /api/messages
app.post('/api/messages', (req, res) => {
    const { name, email, message } = req.body;
    db.run(
        `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`,
        [name, email, message],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            res.json({ success: true, message: "Your message was sent to the Admin account!" });
        }
    );
});

// Admin Get All Messages (Inbox)
app.get('/api/admin/messages', adminAuth, (req, res) => {
    db.all(`SELECT id, name, email, message, created_at FROM messages ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, messages: rows });
    });
});

// Admin Get Rank Stats
app.get('/api/admin/stats', adminAuth, (req, res) => {
    db.all(`SELECT country as kyu, COUNT(*) as count FROM users GROUP BY country`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, stats: rows });
    });
});

// Admin Delete User Endpoint
app.delete('/api/admin/users/:id', adminAuth, (req, res) => {
    db.run(`DELETE FROM users WHERE id = ? AND username != 'admin'`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, message: "User deleted successfully" });
    });
});

// ==================== EVENT CALENDAR API ====================

// Get Events (by month or all)
app.get('/api/events', (req, res) => {
    const { month, year } = req.query;
    let query = `SELECT * FROM events ORDER BY event_date ASC`;
    let params = [];

    if (month && year) {
        const monthStr = String(month).padStart(2, '0');
        query = `SELECT * FROM events WHERE event_date LIKE ? ORDER BY event_date ASC`;
        params = [`${year}-${monthStr}%`];
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, events: rows });
    });
});

// Create Event (Admin only)
app.post('/api/events', adminAuth, (req, res) => {
    const { title, description, event_date, event_type } = req.body;
    if (!title || !event_date) {
        return res.status(400).json({ success: false, message: "Title and date are required" });
    }

    db.run(
        `INSERT INTO events (title, description, event_date, event_type) VALUES (?, ?, ?, ?)`,
        [title, description || '', event_date, event_type || 'event'],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            res.json({ success: true, message: "Event created", id: this.lastID });
        }
    );
});

// Delete Event (Admin only)
app.delete('/api/events/:id', adminAuth, (req, res) => {
    db.run(`DELETE FROM events WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, message: "Event deleted" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} `);
});
