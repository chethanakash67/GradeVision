import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../db.json');

// Helper function to read the database
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], students: [], alerts: [], gamification: {} };
  }
};

// Helper function to write to the database
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

export class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role || 'student';
    this.avatar = data.avatar || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async findByEmail(email) {
    const db = readDB();
    return db.users.find(user => user.email === email) || null;
  }

  static async findById(id) {
    const db = readDB();
    return db.users.find(user => user.id === id) || null;
  }

  static async create(userData) {
    const db = readDB();
    const user = new User(userData);
    const userObj = { ...user };
    db.users.push(userObj);
    writeDB(db);
    return userObj;
  }

  static async update(id, updateData) {
    const db = readDB();
    const index = db.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    db.users[index] = { 
      ...db.users[index], 
      ...updateData, 
      updatedAt: new Date().toISOString() 
    };
    writeDB(db);
    return db.users[index];
  }

  static async delete(id) {
    const db = readDB();
    const index = db.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    
    db.users.splice(index, 1);
    writeDB(db);
    return true;
  }

  static async getAll() {
    const db = readDB();
    return db.users;
  }

  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}

export default User;
