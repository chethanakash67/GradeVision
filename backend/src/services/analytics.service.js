import { Student } from '../models/Student.model.js';

/**
 * Analytics Service
 * Provides aggregated analytics and insights
 */

/**
 * Get overview statistics
 */
export const getOverviewStats = async () => {
  const stats = await Student.getStats();
  const students = await Student.findAll();

  // Calculate additional metrics
  const gradeDistribution = {};
  const sectionDistribution = {};
  const subjectPopularity = {};

  students.forEach(student => {
    // Grade distribution
    gradeDistribution[student.grade] = (gradeDistribution[student.grade] || 0) + 1;
    
    // Section distribution
    sectionDistribution[student.section] = (sectionDistribution[student.section] || 0) + 1;
    
    // Subject popularity
    student.subjects?.forEach(subject => {
      subjectPopularity[subject] = (subjectPopularity[subject] || 0) + 1;
    });
  });

  return {
    ...stats,
    gradeDistribution,
    sectionDistribution,
    topSubjects: Object.entries(subjectPopularity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  };
};

/**
 * Get attendance analytics
 */
export const getAttendanceAnalytics = async () => {
  const students = await Student.findAll();
  
  // Overall attendance distribution
  const attendanceRanges = {
    excellent: { min: 90, max: 100, count: 0 },
    good: { min: 75, max: 89, count: 0 },
    average: { min: 60, max: 74, count: 0 },
    poor: { min: 0, max: 59, count: 0 }
  };

  students.forEach(student => {
    const att = student.attendance;
    if (att >= 90) attendanceRanges.excellent.count++;
    else if (att >= 75) attendanceRanges.good.count++;
    else if (att >= 60) attendanceRanges.average.count++;
    else attendanceRanges.poor.count++;
  });

  // Monthly trend (aggregated from all students)
  const monthlyTrend = ['Sep', 'Oct', 'Nov', 'Dec'].map(month => {
    let totalAttendance = 0;
    let count = 0;
    
    students.forEach(student => {
      const monthData = student.performanceHistory?.find(h => h.month === month);
      if (monthData) {
        totalAttendance += monthData.attendance;
        count++;
      }
    });

    return {
      month,
      average: count > 0 ? Math.round(totalAttendance / count) : 0
    };
  });

  return {
    distribution: attendanceRanges,
    monthlyTrend,
    averageAttendance: Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)
  };
};

/**
 * Get performance analytics
 */
export const getPerformanceAnalytics = async () => {
  const students = await Student.findAll();

  // GPA distribution
  const gpaRanges = {
    'A (3.7-4.0)': 0,
    'B (3.0-3.6)': 0,
    'C (2.0-2.9)': 0,
    'D (1.0-1.9)': 0,
    'F (0-0.9)': 0
  };

  students.forEach(student => {
    const gpa = student.currentGPA;
    if (gpa >= 3.7) gpaRanges['A (3.7-4.0)']++;
    else if (gpa >= 3.0) gpaRanges['B (3.0-3.6)']++;
    else if (gpa >= 2.0) gpaRanges['C (2.0-2.9)']++;
    else if (gpa >= 1.0) gpaRanges['D (1.0-1.9)']++;
    else gpaRanges['F (0-0.9)']++;
  });

  // Monthly GPA trend
  const monthlyTrend = ['Sep', 'Oct', 'Nov', 'Dec'].map(month => {
    let totalGPA = 0;
    let count = 0;
    
    students.forEach(student => {
      const monthData = student.performanceHistory?.find(h => h.month === month);
      if (monthData) {
        totalGPA += monthData.gpa;
        count++;
      }
    });

    return {
      month,
      averageGPA: count > 0 ? Math.round((totalGPA / count) * 100) / 100 : 0
    };
  });

  // Top performers
  const topPerformers = [...students]
    .sort((a, b) => b.currentGPA - a.currentGPA)
    .slice(0, 5)
    .map(s => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      gpa: s.currentGPA,
      grade: s.grade
    }));

  // At-risk students
  const atRiskStudents = students
    .filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium')
    .map(s => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      gpa: s.currentGPA,
      riskLevel: s.riskLevel,
      attendance: s.attendance
    }));

  return {
    gpaDistribution: gpaRanges,
    monthlyTrend,
    topPerformers,
    atRiskStudents,
    averageGPA: Math.round((students.reduce((sum, s) => sum + s.currentGPA, 0) / students.length) * 100) / 100
  };
};

/**
 * Get engagement analytics
 */
export const getEngagementAnalytics = async () => {
  const students = await Student.findAll();

  // Study hours distribution
  const studyHoursData = students.map(s => ({
    name: `${s.firstName} ${s.lastName.charAt(0)}.`,
    hours: s.studyHours
  }));

  // Assignment completion rates
  const assignmentData = students.map(s => ({
    name: `${s.firstName} ${s.lastName.charAt(0)}.`,
    completed: s.assignmentsCompleted,
    total: s.totalAssignments,
    rate: Math.round((s.assignmentsCompleted / s.totalAssignments) * 100)
  }));

  // Streak leaders
  const streakLeaders = [...students]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5)
    .map(s => ({
      name: `${s.firstName} ${s.lastName}`,
      streak: s.streak
    }));

  return {
    studyHours: studyHoursData,
    assignments: assignmentData,
    streakLeaders,
    averageStudyHours: Math.round(students.reduce((sum, s) => sum + s.studyHours, 0) / students.length),
    averageCompletionRate: Math.round(
      students.reduce((sum, s) => sum + (s.assignmentsCompleted / s.totalAssignments) * 100, 0) / students.length
    )
  };
};

/**
 * Get comparative analytics
 */
export const getComparativeAnalytics = async (studentId) => {
  const students = await Student.findAll();
  const student = await Student.findById(studentId);
  
  if (!student) return null;

  const classAvg = {
    gpa: Math.round((students.reduce((sum, s) => sum + s.currentGPA, 0) / students.length) * 100) / 100,
    attendance: Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length),
    studyHours: Math.round(students.reduce((sum, s) => sum + s.studyHours, 0) / students.length)
  };

  return {
    student: {
      gpa: student.currentGPA,
      attendance: student.attendance,
      studyHours: student.studyHours
    },
    classAverage: classAvg,
    comparison: {
      gpa: student.currentGPA - classAvg.gpa,
      attendance: student.attendance - classAvg.attendance,
      studyHours: student.studyHours - classAvg.studyHours
    }
  };
};

export default {
  getOverviewStats,
  getAttendanceAnalytics,
  getPerformanceAnalytics,
  getEngagementAnalytics,
  getComparativeAnalytics
};
