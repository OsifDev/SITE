const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('db/database.db');
db.exec(fs.readFileSync('db/init.sql', 'utf8'));

const user = db.prepare('SELECT * FROM users WHERE username = ?').get('demo');
if (!user) {
  db.prepare(
    'INSERT INTO users (username, balance) VALUES (?, ?)'
  ).run('demo', 1000);
}

module.exports = db;
