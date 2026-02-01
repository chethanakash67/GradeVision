import { v4 as uuidv4 } from 'uuid';

// In-memory student storage with sample data
const students = new Map();

// Generate sample students
const sampleStudents = [
  {
    id: uuidv4(),
    userId: null,
    studentId: 'STU001',
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@student.edu',
    grade: '10',
    section: 'A',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'],
    attendance: 92,
    currentGPA: 3.7,
    riskLevel: 'low',
    enrollmentDate: '2024-08-15',
    performanceHistory: [
      { month: 'Sep', gpa: 3.5, attendance: 95 },
      { month: 'Oct', gpa: 3.6, attendance: 92 },
      { month: 'Nov', gpa: 3.7, attendance: 90 },
      { month: 'Dec', gpa: 3.7, attendance: 92 }
    ],
    badges: ['Perfect Attendance', 'Math Wizard', 'Quick Learner'],
    streak: 15,
    studyHours: 28,
    assignmentsCompleted: 45,
    totalAssignments: 48
  },
  {
    id: uuidv4(),
    userId: null,
    studentId: 'STU002',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@student.edu',
    grade: '10',
    section: 'B',
    subjects: ['Mathematics', 'Biology', 'Chemistry', 'English', 'History'],
    attendance: 78,
    currentGPA: 2.8,
    riskLevel: 'medium',
    enrollmentDate: '2024-08-15',
    performanceHistory: [
      { month: 'Sep', gpa: 3.2, attendance: 88 },
      { month: 'Oct', gpa: 3.0, attendance: 82 },
      { month: 'Nov', gpa: 2.9, attendance: 75 },
      { month: 'Dec', gpa: 2.8, attendance: 78 }
    ],
    badges: ['Team Player', 'Creative Thinker'],
    streak: 5,
    studyHours: 18,
    assignmentsCompleted: 38,
    totalAssignments: 48
  },
  {
    id: uuidv4(),
    userId: null,
    studentId: 'STU003',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@student.edu',
    grade: '11',
    section: 'A',
    subjects: ['Advanced Mathematics', 'Physics', 'Computer Science', 'English', 'Economics'],
    attendance: 96,
    currentGPA: 3.9,
    riskLevel: 'low',
    enrollmentDate: '2023-08-20',
    performanceHistory: [
      { month: 'Sep', gpa: 3.8, attendance: 98 },
      { month: 'Oct', gpa: 3.85, attendance: 95 },
      { month: 'Nov', gpa: 3.9, attendance: 97 },
      { month: 'Dec', gpa: 3.9, attendance: 96 }
    ],
    badges: ['Honor Roll', 'Science Star', 'Perfect Attendance', 'Coding Champion'],
    streak: 30,
    studyHours: 35,
    assignmentsCompleted: 50,
    totalAssignments: 50
  },
  {
    id: uuidv4(),
    userId: null,
    studentId: 'STU004',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@student.edu',
    grade: '9',
    section: 'C',
    subjects: ['Mathematics', 'Biology', 'English', 'Art', 'Geography'],
    attendance: 65,
    currentGPA: 2.3,
    riskLevel: 'high',
    enrollmentDate: '2024-08-15',
    performanceHistory: [
      { month: 'Sep', gpa: 2.8, attendance: 80 },
      { month: 'Oct', gpa: 2.6, attendance: 72 },
      { month: 'Nov', gpa: 2.4, attendance: 65 },
      { month: 'Dec', gpa: 2.3, attendance: 65 }
    ],
    badges: ['Art Enthusiast'],
    streak: 2,
    studyHours: 12,
    assignmentsCompleted: 30,
    totalAssignments: 48
  },
  {
    id: uuidv4(),
    userId: null,
    studentId: 'STU005',
    firstName: 'James',
    lastName: 'Brown',
    email: 'james.brown@student.edu',
    grade: '12',
    section: 'A',
    subjects: ['Calculus', 'Physics', 'Chemistry', 'English Literature', 'Psychology'],
    attendance: 88,
    currentGPA: 3.4,
    riskLevel: 'low',
    enrollmentDate: '2022-08-18',
    performanceHistory: [
      { month: 'Sep', gpa: 3.3, attendance: 90 },
      { month: 'Oct', gpa: 3.35, attendance: 88 },
      { month: 'Nov', gpa: 3.4, attendance: 86 },
      { month: 'Dec', gpa: 3.4, attendance: 88 }
    ],
    badges: ['Senior Leader', 'Consistent Performer', 'Mentor'],
    streak: 12,
    studyHours: 25,
    assignmentsCompleted: 44,
    totalAssignments: 48
  }
];

// Initialize sample data
sampleStudents.forEach(student => {
  students.set(student.id, student);
});

export class Student {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.userId = data.userId;
    this.studentId = data.studentId;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.grade = data.grade;
    this.section = data.section;
    this.subjects = data.subjects || [];
    this.attendance = data.attendance || 0;
    this.currentGPA = data.currentGPA || 0;
    this.riskLevel = data.riskLevel || 'medium';
    this.enrollmentDate = data.enrollmentDate;
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
    let result = Array.from(students.values());
    
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
    return students.get(id) || null;
  }

  static async findByStudentId(studentId) {
    for (const student of students.values()) {
      if (student.studentId === studentId) return student;
    }
    return null;
  }

  static async create(studentData) {
    const student = new Student(studentData);
    students.set(student.id, student);
    return student;
  }

  static async update(id, updateData) {
    const existing = students.get(id);
    if (!existing) return null;
    
    const updated = { ...existing, ...updateData, updatedAt: new Date().toISOString() };
    students.set(id, updated);
    return updated;
  }

  static async delete(id) {
    return students.delete(id);
  }

  static async getStats() {
    const allStudents = Array.from(students.values());
    const total = allStudents.length;
    
    const riskDistribution = {
      low: allStudents.filter(s => s.riskLevel === 'low').length,
      medium: allStudents.filter(s => s.riskLevel === 'medium').length,
      high: allStudents.filter(s => s.riskLevel === 'high').length
    };
    
    const avgGPA = allStudents.reduce((sum, s) => sum + s.currentGPA, 0) / total;
    const avgAttendance = allStudents.reduce((sum, s) => sum + s.attendance, 0) / total;
    
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
