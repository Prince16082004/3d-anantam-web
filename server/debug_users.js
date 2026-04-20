import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'anantam.db');
const db = new Database(dbPath);

const users = db.prepare('SELECT id, name, email, role FROM users').all();
console.log('--- USERS IN DATABASE ---');
console.table(users);
db.close();
