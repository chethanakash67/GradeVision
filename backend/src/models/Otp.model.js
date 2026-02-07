import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../db.json');

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const db = JSON.parse(data);
    if (!db.otps) db.otps = [];
    return db;
  } catch {
    return { users: [], students: [], alerts: [], gamification: {}, otps: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

export class Otp {
  /**
   * Generate a 6-digit OTP for a given email + purpose.
   * purpose: 'signup' | 'forgot-password'
   * Expires in 5 minutes.
   */
  static generate(email, purpose = 'signup') {
    const db = readDB();

    // Remove any existing OTPs for this email + purpose
    db.otps = db.otps.filter(
      (o) => !(o.email === email && o.purpose === purpose)
    );

    const code = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
    const otp = {
      id: uuidv4(),
      email,
      code,
      purpose,
      attempts: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 min
    };

    db.otps.push(otp);
    writeDB(db);
    return code;
  }

  /**
   * Verify the OTP.
   * Returns { valid: true } or { valid: false, reason: '...' }
   */
  static verify(email, code, purpose = 'signup') {
    const db = readDB();
    const index = db.otps.findIndex(
      (o) => o.email === email && o.purpose === purpose
    );

    if (index === -1) {
      return { valid: false, reason: 'No OTP found. Please request a new one.' };
    }

    const otp = db.otps[index];

    // Check expiry
    if (new Date(otp.expiresAt) < new Date()) {
      db.otps.splice(index, 1);
      writeDB(db);
      return { valid: false, reason: 'OTP has expired. Please request a new one.' };
    }

    // Check max attempts (5)
    if (otp.attempts >= 5) {
      db.otps.splice(index, 1);
      writeDB(db);
      return { valid: false, reason: 'Too many incorrect attempts. Please request a new OTP.' };
    }

    // Check code
    if (otp.code !== code) {
      db.otps[index].attempts += 1;
      writeDB(db);
      const remaining = 5 - db.otps[index].attempts;
      return {
        valid: false,
        reason: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
      };
    }

    // Valid — remove OTP so it can't be reused
    db.otps.splice(index, 1);
    writeDB(db);
    return { valid: true };
  }

  /** Clean up expired OTPs (called periodically) */
  static cleanup() {
    const db = readDB();
    const now = new Date();
    db.otps = (db.otps || []).filter((o) => new Date(o.expiresAt) > now);
    writeDB(db);
  }
}

export default Otp;
