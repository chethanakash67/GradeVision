import express from 'express';
import {
  getBadges,
  getLeaderboard,
  getStreak,
  getAchievements,
  claimReward,
  getProgress
} from '../controllers/gamification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Gamification routes
router.get('/badges', getBadges);
router.get('/badges/:userId', getBadges);
router.get('/leaderboard', getLeaderboard);
router.get('/streak/:userId', getStreak);
router.get('/achievements/:userId', getAchievements);
router.get('/progress/:userId', getProgress);
router.post('/claim-reward', claimReward);

export default router;
