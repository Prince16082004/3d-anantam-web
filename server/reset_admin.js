import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'anantam.db');
const db = new Database(dbPath);

async function resetAdmin() {
    const email = 'admin@anantam.com';
    const newPassword = 'admin123';
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(newPassword, salt);

    const result = db.prepare('UPDATE users SET password_hash = ? WHERE email = ? AND role = ?').run(hash, email, 'admin');
    
    if (result.changes > 0) {
        console.log(`Successfully reset password for ${email} to ${newPassword}`);
    } else {
        console.log(`Failed to find admin user with email ${email}`);
    }
    db.close();
}

resetAdmin();
