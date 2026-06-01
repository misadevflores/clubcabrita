import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'cabritas.sqlite');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL
  )
`);

// Insert default admin user if none exists (password is 'admin')
const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!adminUser) {
    // In a real app, hash this password, but for simplicity we keep it plain or simply hash it:
    // Using plain text for simple tutorial, but recommend hashed.
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', 'admin');
}

export default db;
