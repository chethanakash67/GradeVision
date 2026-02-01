import express from 'express';
import {
  getDashboardStats,
  getPerformanceTrends,
  getAttendanceAnalytics,
  getRiskDistribution,
  getSubjectPerformance,
  getClassComparison,
  getStudentAnalytics
} from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Dashboard overview
router.get('/dashboard', getDashboardStats);

// Performance analytics
router.get('/performance/trends', getPerformanceTrends);
router.get('/performance/subjects', getSubjectPerformance);
router.get('/performance/class-comparison', getClassComparison);

// Attendance analytics
router.get('/attendance', getAttendanceAnalytics);

// Risk analysis
router.get('/risk-distribution', getRiskDistribution);

// Individual student analytics
router.get('/student/:id', getStudentAnalytics);

export default router;
