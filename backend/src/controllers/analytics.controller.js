import analyticsService from '../services/analytics.service.js';
import { catchAsync } from '../middleware/error.middleware.js';

/**
 * @desc    Get overview statistics
 * @route   GET /api/analytics/overview
 * @access  Private
 */
export const getOverview = catchAsync(async (req, res, next) => {
  const stats = await analyticsService.getOverviewStats();

  res.status(200).json({
    success: true,
    data: stats
  });
});

/**
 * @desc    Get attendance analytics
 * @route   GET /api/analytics/attendance
 * @access  Private
 */
export const getAttendance = catchAsync(async (req, res, next) => {
  const analytics = await analyticsService.getAttendanceAnalytics();

  res.status(200).json({
    success: true,
    data: analytics
  });
});

/**
 * @desc    Get performance analytics
 * @route   GET /api/analytics/performance
 * @access  Private
 */
export const getPerformance = catchAsync(async (req, res, next) => {
  const analytics = await analyticsService.getPerformanceAnalytics();

  res.status(200).json({
    success: true,
    data: analytics
  });
});

/**
 * @desc    Get engagement analytics
 * @route   GET /api/analytics/engagement
 * @access  Private
 */
export const getEngagement = catchAsync(async (req, res, next) => {
  const analytics = await analyticsService.getEngagementAnalytics();

  res.status(200).json({
    success: true,
    data: analytics
  });
});

/**
 * @desc    Get comparative analytics for a student
 * @route   GET /api/analytics/compare/:studentId
 * @access  Private
 */
export const getComparison = catchAsync(async (req, res, next) => {
  const analytics = await analyticsService.getComparativeAnalytics(req.params.studentId);

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
