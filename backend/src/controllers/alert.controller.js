import { Alert } from '../models/Alert.model.js';
import { AppError, catchAsync } from '../middleware/error.middleware.js';

/**
 * @desc    Get all alerts for user
 * @route   GET /api/alerts
 * @access  Private
 */
export const getAlerts = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, type, read } = req.query;
  
  const alerts = await Alert.findByUser(req.user.id, {
    page: parseInt(page),
    limit: parseInt(limit),
    type,
    read: read === 'true' ? true : read === 'false' ? false : undefined
  });

  res.json({
    success: true,
    data: alerts
  });
});

/**
 * @desc    Get single alert
 * @route   GET /api/alerts/:id
 * @access  Private
 */
export const getAlert = catchAsync(async (req, res, next) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    return next(new AppError('Alert not found', 404));
  }

  res.json({
    success: true,
    data: alert
  });
});

/**
 * @desc    Create alert
 * @route   POST /api/alerts
 * @access  Private
 */
export const createAlert = catchAsync(async (req, res, next) => {
  const alert = await Alert.create({
    ...req.body,
    userId: req.user.id
  });

  res.status(201).json({
    success: true,
    data: alert
  });
});

/**
 * @desc    Mark alert as read
 * @route   PUT /api/alerts/:id
 * @access  Private
 */
export const markAsRead = catchAsync(async (req, res, next) => {
  const alert = await Alert.markAsRead(req.params.id);

  if (!alert) {
    return next(new AppError('Alert not found', 404));
  }

  res.json({
    success: true,
    data: alert
  });
});

/**
 * @desc    Mark all alerts as read
 * @route   PUT /api/alerts/mark-all-read
 * @access  Private
 */
export const markAllAsRead = catchAsync(async (req, res, next) => {
  await Alert.markAllAsRead(req.user.id);

  res.json({
    success: true,
    message: 'All alerts marked as read'
  });
});

/**
 * @desc    Delete alert
 * @route   DELETE /api/alerts/:id
 * @access  Private
 */
export const deleteAlert = catchAsync(async (req, res, next) => {
  const alert = await Alert.delete(req.params.id);

  if (!alert) {
    return next(new AppError('Alert not found', 404));
  }

  res.json({
    success: true,
    message: 'Alert deleted'
  });
});

/**
 * @desc    Get unread alert count
 * @route   GET /api/alerts/unread-count
 * @access  Private
 */
export const getUnreadCount = catchAsync(async (req, res, next) => {
  const count = await Alert.getUnreadCount(req.user.id);

  res.json({
    success: true,
    data: { count }
  });
});
