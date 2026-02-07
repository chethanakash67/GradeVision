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

export class Alert {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.studentId = data.studentId;
    this.type = data.type; // 'attendance', 'performance', 'achievement', 'recommendation', 'intervention', 'risk'
    this.severity = data.severity || 'medium'; // 'low', 'medium', 'high'
    this.title = data.title;
    this.message = data.message;
    this.actionRequired = data.actionRequired || false;
    this.read = data.read || false;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static async findAll(filters = {}) {
    const db = readDB();
    let result = db.alerts || [];
    
    if (filters.studentId) {
      result = result.filter(a => a.studentId === filters.studentId);
    }
    if (filters.type) {
      result = result.filter(a => a.type === filters.type);
    }
    if (filters.severity) {
      result = result.filter(a => a.severity === filters.severity);
    }
    if (filters.unreadOnly) {
      result = result.filter(a => !a.read);
    }
    
    // Sort by createdAt descending
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return result;
  }

  static async findByUser(userId, options = {}) {
    const db = readDB();
    const { page = 1, limit = 10, type, read } = options;
    let result = db.alerts || [];
    
    if (type) {
      result = result.filter(a => a.type === type);
    }
    if (read !== undefined) {
      result = result.filter(a => a.read === read);
    }
    
    // Sort by createdAt descending
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const start = (page - 1) * limit;
    const paginatedResult = result.slice(start, start + limit);
    
    return {
      alerts: paginatedResult,
      total: result.length,
      page,
      totalPages: Math.ceil(result.length / limit)
    };
  }

  static async findById(id) {
    const db = readDB();
    return db.alerts.find(a => a.id === id) || null;
  }

  static async create(alertData) {
    const db = readDB();
    const alert = new Alert(alertData);
    const alertObj = { ...alert };
    db.alerts.push(alertObj);
    writeDB(db);
    return alertObj;
  }

  static async markAsRead(id) {
    const db = readDB();
    const index = db.alerts.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    db.alerts[index].read = true;
    writeDB(db);
    return db.alerts[index];
  }

  static async markAllAsRead(studentId = null) {
    const db = readDB();
    db.alerts.forEach(alert => {
      if (!studentId || alert.studentId === studentId) {
        alert.read = true;
      }
    });
    writeDB(db);
    return true;
  }

  static async delete(id) {
    const db = readDB();
    const index = db.alerts.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    db.alerts.splice(index, 1);
    writeDB(db);
    return true;
  }

  static async getUnreadCount(studentId = null) {
    const db = readDB();
    let count = 0;
    for (const alert of db.alerts) {
      if (!alert.read && (!studentId || alert.studentId === studentId)) {
        count++;
      }
    }
    return count;
  }
}

export default Alert;
