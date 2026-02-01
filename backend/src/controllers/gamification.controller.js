import { GamificationService } from '../services/gamification.service.js';
import { Student } from '../models/Student.model.js';
import { AppError, catchAsync } from '../middleware/error.middleware.js';

/**
 * @desc    Get user badges
 * @route   GET /api/gamification/badges
 * @route   GET /api/gamification/badges/:userId
 * @access  Private
 */
export const getBadges = catchAsync(async (req, res, next) => {
  const userId = req.params.userId || req.user.id;
  
  // Get all available badges with earned status
  const badges = GamificationService.getAllBadges();
  const students = await Student.findAll();
  
  // Find student by userId or return all badges
  const student = students.find(s => s.userId === userId || s.id === userId);
  
  const badgesWithStatus = badges.map(badge => ({
    ...badge,
    earned: student ? student.badges?.includes(badge.name) : false,
    earnedDate: student?.badges?.includes(badge.name) ? '2026-01-15' : null
  }));

  res.json({
    success: true,
    data: badgesWithStatus
  });
});

/**
 * @desc    Get leaderboard
 * @route   GET /api/gamification/leaderboard
 * @access  Private
 */
export const getLeaderboard = catchAsync(async (req, res, next) => {
  const { limit = 10, timeframe = 'weekly' } = req.query;
  
  const students = await Student.findAll();
  
  // Calculate scores and rank
  const leaderboard = students
    .map(student => ({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      avatar: student.avatar || null,
      score: Math.round(
        (student.currentGPA * 100) + 
        (student.attendance * 0.5) + 
        (student.streak * 10) + 
        ((student.badges?.length || 0) * 25)
      ),
      gpa: student.currentGPA,
      streak: student.streak,
      badges: student.badges?.length || 0,
      rank: 0
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, parseInt(limit))
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      change: Math.floor(Math.random() * 5) - 2 // Random position change for demo
    }));

  res.json({
    success: true,
    data: {
      leaderboard,
      timeframe,
      totalParticipants: students.length
    }
  });
});

/**
 * @desc    Get user streak
 * @route   GET /api/gamification/streak/:userId
 * @access  Private
 */
export const getStreak = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  
  const students = await Student.findAll();
  const student = students.find(s => s.userId === userId || s.id === userId);
  
  if (!student) {
    // Return default streak data
    return res.json({
      success: true,
      data: {
        currentStreak: 0,
        longestStreak: 0,
        lastActive: null,
        weeklyActivity: [false, false, false, false, false, false, false]
      }
    });
  }

  // Generate weekly activity for visualization
  const weeklyActivity = Array(7).fill(false).map((_, i) => 
    i < (student.streak % 7 || 7) ? true : Math.random() > 0.3
  );

  res.json({
    success: true,
    data: {
      currentStreak: student.streak,
      longestStreak: Math.max(student.streak, Math.floor(student.streak * 1.2)),
      lastActive: new Date().toISOString(),
      weeklyActivity,
      streakRewards: GamificationService.getStreakRewards(student.streak)
    }
  });
});

/**
 * @desc    Get user achievements
 * @route   GET /api/gamification/achievements/:userId
 * @access  Private
 */
export const getAchievements = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  
  const students = await Student.findAll();
  const student = students.find(s => s.userId === userId || s.id === userId);

  const achievements = GamificationService.getAchievements(student);

  res.json({
    success: true,
    data: achievements
  });
});

/**
 * @desc    Get user progress
 * @route   GET /api/gamification/progress/:userId
 * @access  Private
 */
export const getProgress = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  
  const students = await Student.findAll();
  const student = students.find(s => s.userId === userId || s.id === userId);

  if (!student) {
    return res.json({
      success: true,
      data: {
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        totalXp: 0,
        rank: 'Beginner'
      }
    });
  }

  const progress = GamificationService.calculateProgress(student);

  res.json({
    success: true,
    data: progress
  });
});

/**
 * @desc    Claim reward
 * @route   POST /api/gamification/claim-reward
 * @access  Private
 */
export const claimReward = catchAsync(async (req, res, next) => {
  const { rewardId } = req.body;

  if (!rewardId) {
    return next(new AppError('Reward ID is required', 400));
  }

  // In a real app, this would update the database
  res.json({
    success: true,
    message: 'Reward claimed successfully',
    data: {
      rewardId,
      claimedAt: new Date().toISOString()
    }
  });
});
