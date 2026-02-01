import express from 'express';
import {
  getAlerts,
  getAlert,
  createAlert,
  markAsRead,
  markAllAsRead,
  deleteAlert,
  getUnreadCount
} from '../controllers/alert.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Alert routes
router.route('/')
  .get(getAlerts)
  .post(createAlert);

router.get('/unread-count', getUnreadCount);
router.put('/mark-all-read', markAllAsRead);

router.route('/:id')
  .get(getAlert)
  .put(markAsRead)
  .delete(deleteAlert);

export default router;
