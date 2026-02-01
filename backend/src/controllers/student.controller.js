import { Student } from '../models/Student.model.js';
import { AppError, catchAsync } from '../middleware/error.middleware.js';

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Private
 */
export const getStudents = catchAsync(async (req, res, next) => {
  const { grade, section, riskLevel } = req.query;
  
  const filters = {};
  if (grade) filters.grade = grade;
  if (section) filters.section = section;
  if (riskLevel) filters.riskLevel = riskLevel;

  const students = await Student.findAll(filters);

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

/**
 * @desc    Get single student
 * @route   GET /api/students/:id
 * @access  Private
 */
export const getStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

/**
 * @desc    Create new student
 * @route   POST /api/students
 * @access  Private/Admin
 */
export const createStudent = catchAsync(async (req, res, next) => {
  const student = await Student.create(req.body);

  res.status(201).json({
    success: true,
    data: student
  });
});

/**
 * @desc    Update student
 * @route   PUT /api/students/:id
 * @access  Private/Admin
 */
export const updateStudent = catchAsync(async (req, res, next) => {
  const student = await Student.update(req.params.id, req.body);

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

/**
 * @desc    Delete student
 * @route   DELETE /api/students/:id
 * @access  Private/Admin
 */
export const deleteStudent = catchAsync(async (req, res, next) => {
  const deleted = await Student.delete(req.params.id);

  if (!deleted) {
    return next(new AppError('Student not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Get student statistics
 * @route   GET /api/students/stats/overview
 * @access  Private
 */
export const getStudentStats = catchAsync(async (req, res, next) => {
  const stats = await Student.getStats();

  res.status(200).json({
    success: true,
    data: stats
  });
});
