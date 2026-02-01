import express from 'express';
import {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
  getStudentPerformance
} from '../controllers/student.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Student routes
router.route('/')
  .get(getAllStudents)
  .post(authorize('admin', 'teacher'), createStudent);

router.route('/stats')
  .get(getStudentStats);

router.route('/:id')
  .get(getStudent)
  .put(authorize('admin', 'teacher'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

router.route('/:id/performance')
  .get(getStudentPerformance);

export default router;
