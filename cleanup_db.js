const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // 1. Delete all messages
    db.run("DELETE FROM messages", (err) => {
        if (err) console.error("Error deleting messages:", err.message);
        else console.log("All messages deleted successfully.");
    });

    // 2. Delete all users except 'admin'
    db.run("DELETE FROM users WHERE username != 'admin'", (err) => {
        if (err) console.error("Error deleting users:", err.message);
        else console.log("All users except 'admin' deleted successfully.");
    });
});

db.close();
