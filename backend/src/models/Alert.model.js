import { v4 as uuidv4 } from 'uuid';

// In-memory alert storage
const alerts = new Map();

// Generate sample alerts
const sampleAlerts = [
  {
    id: uuidv4(),
    studentId: 'STU004',
    type: 'attendance',
    severity: 'high',
    title: 'Critical Attendance Drop',
    message: 'Emily Davis has missed 5 consecutive classes. Attendance dropped below 70%.',
    actionRequired: true,
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    studentId: 'STU002',
    type: 'performance',
    severity: 'medium',
    title: 'GPA Decline Detected',
    message: 'Sarah Williams GPA has declined by 0.4 points over the last 2 months.',
    actionRequired: true,
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    studentId: 'STU003',
    type: 'achievement',
    severity: 'low',
    title: 'New Achievement Unlocked',
    message: 'Michael Chen has earned the "30 Day Streak" badge!',
    actionRequired: false,
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    studentId: 'STU001',
    type: 'recommendation',
    severity: 'low',
    title: 'Study Recommendation',
    message: 'Based on recent performance, Alex Johnson might benefit from additional practice in Organic Chemistry.',
    actionRequired: false,
    read: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    studentId: 'STU004',
    type: 'intervention',
    severity: 'high',
    title: 'Intervention Required',
    message: 'Emily Davis performance prediction shows high risk of failing the semester. Immediate intervention recommended.',
    actionRequired: true,
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

sampleAlerts.forEach(alert => {
  alerts.set(alert.id, alert);
});

export class Alert {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.studentId = data.studentId;
    this.type = data.type; // 'attendance', 'performance', 'achievement', 'recommendation', 'intervention'
    this.severity = data.severity || 'medium'; // 'low', 'medium', 'high'
    this.title = data.title;
    this.message = data.message;
    this.actionRequired = data.actionRequired || false;
    this.read = data.read || false;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static async findAll(filters = {}) {
    let result = Array.from(alerts.values());
    
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

  static async findById(id) {
    return alerts.get(id) || null;
  }

  static async create(alertData) {
    const alert = new Alert(alertData);
    alerts.set(alert.id, alert);
    return alert;
  }

  static async markAsRead(id) {
    const alert = alerts.get(id);
    if (!alert) return null;
    
    alert.read = true;
    alerts.set(id, alert);
    return alert;
  }

  static async markAllAsRead(studentId = null) {
    for (const [id, alert] of alerts.entries()) {
      if (!studentId || alert.studentId === studentId) {
        alert.read = true;
        alerts.set(id, alert);
      }
    }
    return true;
  }

  static async delete(id) {
    return alerts.delete(id);
  }

  static async getUnreadCount(studentId = null) {
    let count = 0;
    for (const alert of alerts.values()) {
      if (!alert.read && (!studentId || alert.studentId === studentId)) {
        count++;
      }
    }
    return count;
  }
}

export default Alert;
