const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const adminUsername = 'admin';
const adminPassword = 'admin123'; // The password you requested

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        
        // Check if admin exists
        db.get("SELECT * FROM users WHERE username = ?", [adminUsername], (err, row) => {
            if (row) {
                // Update existing admin
                db.run("UPDATE users SET password = ? WHERE username = ?", [hashedPassword, adminUsername], (err) => {
                    if (err) console.error("Update error:", err);
                    else console.log(`Admin password updated to: ${adminPassword}`);
                    db.close();
                });
            } else {
                // Create new admin
                db.run(
                    "INSERT INTO users (username, password, email, phone, country) VALUES (?, ?, ?, ?, ?)",
                    [adminUsername, hashedPassword, 'admin@karate.com', '0000000000', 'Local'],
                    (err) => {
                        if (err) console.error("Insert error:", err);
                        else console.log(`Admin account created! Username: ${adminUsername}, Password: ${adminPassword}`);
                        db.close();
                    }
                );
            }
        });
    } catch (e) {
        console.error("Bcrypt error:", e);
    }
}

createAdmin();
