import analyticsService from '../services/analytics.service.js';
import { Student } from '../models/Student.model.js';
import { catchAsync } from '../middleware/error.middleware.js';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/analytics/dashboard
 * @access  Private
 */
export const getDashboardStats = catchAsync(async (req, res, next) => {
  const stats = await analyticsService.getOverviewStats();

  res.status(200).json({
    success: true,
    data: stats
  });
});

/**
 * @desc    Get performance trends
 * @route   GET /api/analytics/performance/trends
 * @access  Private
 */
export const getPerformanceTrends = catchAsync(async (req, res, next) => {
  const trends = await analyticsService.getPerformanceTrends();

  res.status(200).json({
    success: true,
    data: trends
  });
});

/**
 * @desc    Get attendance analytics
 * @route   GET /api/analytics/attendance
 * @access  Private
 */
export const getAttendanceAnalytics = catchAsync(async (req, res, next) => {
  const analytics = await analyticsService.getAttendanceAnalytics();

  res.status(200).json({
    success: true,
    data: analytics
  });
});

/**
 * @desc    Get risk distribution
 * @route   GET /api/analytics/risk-distribution
 * @access  Private
 */
export const getRiskDistribution = catchAsync(async (req, res, next) => {
  const distribution = await analyticsService.getRiskDistribution();

  res.status(200).json({
    success: true,
    data: distribution
  });
});

/**
 * @desc    Get subject performance
 * @route   GET /api/analytics/performance/subjects
 * @access  Private
 */
export const getSubjectPerformance = catchAsync(async (req, res, next) => {
  const performance = await analyticsService.getSubjectPerformance();

  res.status(200).json({
    success: true,
    data: performance
  });
});

/**
 * @desc    Get class comparison
 * @route   GET /api/analytics/performance/class-comparison
 * @access  Private
 */
export const getClassComparison = catchAsync(async (req, res, next) => {
  const comparison = await analyticsService.getClassComparison();

  res.status(200).json({
    success: true,
    data: comparison
  });
});

/**
 * @desc    Get individual student analytics
 * @route   GET /api/analytics/student/:id
 * @access  Private
 */
export const getStudentAnalytics = catchAsync(async (req, res, next) => {
  const analytics = await analyticsService.getStudentAnalytics(req.params.id);

  if (!analytics) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  res.status(200).json({
    success: true,
    data: analytics
  });
});
