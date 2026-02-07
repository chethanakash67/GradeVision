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

export class Student {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.userId = data.userId;
    this.studentId = data.studentId || `STU${Date.now()}`;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.grade = data.grade;
    this.section = data.section;
    this.subjects = data.subjects || [];
    this.attendance = data.attendance || 0;
    this.currentGPA = data.currentGPA || data.gpa || 0;
    this.gpa = data.gpa || data.currentGPA || 0;
    this.riskLevel = data.riskLevel || 'medium';
    this.predictedGrade = data.predictedGrade || 'B';
    this.enrollmentDate = data.enrollmentDate || new Date().toISOString();
    this.performanceHistory = data.performanceHistory || [];
    this.badges = data.badges || [];
    this.streak = data.streak || 0;
    this.studyHours = data.studyHours || 0;
    this.assignmentsCompleted = data.assignmentsCompleted || 0;
    this.totalAssignments = data.totalAssignments || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async findAll(filters = {}) {
    const db = readDB();
    let result = db.students || [];
    
    if (filters.grade) {
      result = result.filter(s => s.grade === filters.grade);
    }
    if (filters.riskLevel) {
      result = result.filter(s => s.riskLevel === filters.riskLevel);
    }
    if (filters.section) {
      result = result.filter(s => s.section === filters.section);
    }
    
    return result;
  }

  static async findById(id) {
    const db = readDB();
    return db.students.find(s => s.id === id) || null;
  }

  static async findByStudentId(studentId) {
    const db = readDB();
    return db.students.find(s => s.studentId === studentId) || null;
  }

  static async create(studentData) {
    const db = readDB();
    const student = new Student(studentData);
    const studentObj = { ...student };
    db.students.push(studentObj);
    writeDB(db);
    return studentObj;
  }

  static async update(id, updateData) {
    const db = readDB();
    const index = db.students.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    db.students[index] = { 
      ...db.students[index], 
      ...updateData, 
      updatedAt: new Date().toISOString() 
    };
    writeDB(db);
    return db.students[index];
  }

  static async delete(id) {
    const db = readDB();
    const index = db.students.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    db.students.splice(index, 1);
    writeDB(db);
    return true;
  }

  static async getStats() {
    const db = readDB();
    const allStudents = db.students || [];
    const total = allStudents.length;
    
    if (total === 0) {
      return {
        totalStudents: 0,
        riskDistribution: { low: 0, medium: 0, high: 0 },
        averageGPA: 0,
        averageAttendance: 0,
        atRiskCount: 0
      };
    }
    
    const riskDistribution = {
      low: allStudents.filter(s => s.riskLevel === 'low').length,
      medium: allStudents.filter(s => s.riskLevel === 'medium').length,
      high: allStudents.filter(s => s.riskLevel === 'high').length
    };
    
    const avgGPA = allStudents.reduce((sum, s) => sum + (s.currentGPA || s.gpa || 0), 0) / total;
    const avgAttendance = allStudents.reduce((sum, s) => sum + (s.attendance || 0), 0) / total;
    
    return {
      totalStudents: total,
      riskDistribution,
      averageGPA: Math.round(avgGPA * 100) / 100,
      averageAttendance: Math.round(avgAttendance * 10) / 10,
      atRiskCount: riskDistribution.high + riskDistribution.medium
    };
  }
}

export default Student;
