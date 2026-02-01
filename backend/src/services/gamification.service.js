/**
 * Gamification Service
 * Handles badges, achievements, streaks, and rewards
 */

// Badge definitions
const BADGES = {
  // Attendance badges
  PERFECT_ATTENDANCE: {
    id: 'perfect_attendance',
    name: 'Perfect Attendance',
    description: 'Maintained 100% attendance for a month',
    icon: '🎯',
    category: 'attendance',
    points: 100
  },
  CONSISTENT_ATTENDEE: {
    id: 'consistent_attendee',
    name: 'Consistent Attendee',
    description: 'Maintained 90%+ attendance for 3 months',
    icon: '📅',
    category: 'attendance',
    points: 150
  },
  
  // Academic badges
  HONOR_ROLL: {
    id: 'honor_roll',
    name: 'Honor Roll',
    description: 'Achieved GPA of 3.5 or higher',
    icon: '🏆',
    category: 'academic',
    points: 200
  },
  MATH_WIZARD: {
    id: 'math_wizard',
    name: 'Math Wizard',
    description: 'Scored 90%+ in Mathematics',
    icon: '🧮',
    category: 'academic',
    points: 100
  },
  SCIENCE_STAR: {
    id: 'science_star',
    name: 'Science Star',
    description: 'Excelled in Science subjects',
    icon: '🔬',
    category: 'academic',
    points: 100
  },
  
  // Streak badges
  WEEK_WARRIOR: {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: '7-day learning streak',
    icon: '🔥',
    category: 'streak',
    points: 50
  },
  MONTHLY_MASTER: {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: '30-day learning streak',
    icon: '⚡',
    category: 'streak',
    points: 200
  },
  
  // Engagement badges
  QUICK_LEARNER: {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Completed 10 assignments ahead of deadline',
    icon: '🚀',
    category: 'engagement',
    points: 75
  },
  TEAM_PLAYER: {
    id: 'team_player',
    name: 'Team Player',
    description: 'Participated in 5+ group activities',
    icon: '🤝',
    category: 'engagement',
    points: 75
  },
  CODING_CHAMPION: {
    id: 'coding_champion',
    name: 'Coding Champion',
    description: 'Completed all coding assignments with excellence',
    icon: '💻',
    category: 'academic',
    points: 150
  },
  CREATIVE_THINKER: {
    id: 'creative_thinker',
    name: 'Creative Thinker',
    description: 'Submitted outstanding creative projects',
    icon: '🎨',
    category: 'engagement',
    points: 100
  },
  MENTOR: {
    id: 'mentor',
    name: 'Mentor',
    description: 'Helped fellow students succeed',
    icon: '🌟',
    category: 'social',
    points: 150
  },
  SENIOR_LEADER: {
    id: 'senior_leader',
    name: 'Senior Leader',
    description: 'Demonstrated leadership as a senior student',
    icon: '👑',
    category: 'social',
    points: 200
  },
  ART_ENTHUSIAST: {
    id: 'art_enthusiast',
    name: 'Art Enthusiast',
    description: 'Showed exceptional creativity in Art',
    icon: '🖼️',
    category: 'academic',
    points: 75
  },
  CONSISTENT_PERFORMER: {
    id: 'consistent_performer',
    name: 'Consistent Performer',
    description: 'Maintained steady performance over time',
    icon: '📊',
    category: 'academic',
    points: 100
  }
};

// Level definitions
const LEVELS = [
  { level: 1, name: 'Beginner', minPoints: 0, maxPoints: 100 },
  { level: 2, name: 'Learner', minPoints: 101, maxPoints: 250 },
  { level: 3, name: 'Achiever', minPoints: 251, maxPoints: 500 },
  { level: 4, name: 'Scholar', minPoints: 501, maxPoints: 1000 },
  { level: 5, name: 'Master', minPoints: 1001, maxPoints: 2000 },
  { level: 6, name: 'Grandmaster', minPoints: 2001, maxPoints: Infinity }
];

/**
 * Get all available badges
 */
export const getAllBadges = () => {
  return Object.values(BADGES);
};

/**
 * Get badge details by name
 */
export const getBadgeByName = (name) => {
  return Object.values(BADGES).find(b => b.name === name) || null;
};

/**
 * Calculate student's total points from badges
 */
export const calculatePoints = (badges) => {
  return badges.reduce((total, badgeName) => {
    const badge = getBadgeByName(badgeName);
    return total + (badge?.points || 0);
  }, 0);
};

/**
 * Get student's current level
 */
export const getLevel = (points) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return {
        ...LEVELS[i],
        nextLevel: LEVELS[i + 1] || null,
        progress: LEVELS[i + 1] 
          ? Math.round(((points - LEVELS[i].minPoints) / (LEVELS[i + 1].minPoints - LEVELS[i].minPoints)) * 100)
          : 100
      };
    }
  }
  return { ...LEVELS[0], progress: 0 };
};

/**
 * Get gamification profile for a student
 */
export const getGamificationProfile = (student) => {
  const badges = (student.badges || []).map(name => getBadgeByName(name)).filter(Boolean);
  const totalPoints = calculatePoints(student.badges || []);
  const level = getLevel(totalPoints);
  
  return {
    badges,
    totalPoints,
    level,
    streak: {
      current: student.streak || 0,
      best: Math.max(student.streak || 0, 30), // Simulated best streak
      nextMilestone: getNextStreakMilestone(student.streak || 0)
    },
    achievements: {
      total: badges.length,
      available: Object.keys(BADGES).length,
      categories: {
        attendance: badges.filter(b => b.category === 'attendance').length,
        academic: badges.filter(b => b.category === 'academic').length,
        streak: badges.filter(b => b.category === 'streak').length,
        engagement: badges.filter(b => b.category === 'engagement').length,
        social: badges.filter(b => b.category === 'social').length
      }
    }
  };
};

/**
 * Get next streak milestone
 */
const getNextStreakMilestone = (currentStreak) => {
  const milestones = [7, 14, 21, 30, 60, 90, 180, 365];
  for (const milestone of milestones) {
    if (currentStreak < milestone) {
      return {
        target: milestone,
        remaining: milestone - currentStreak
      };
    }
  }
  return { target: 365, remaining: 0 };
};

/**
 * Check for new badge eligibility
 */
export const checkBadgeEligibility = (student) => {
  const earnedBadges = student.badges || [];
  const newBadges = [];

  // Check attendance badges
  if (student.attendance >= 100 && !earnedBadges.includes('Perfect Attendance')) {
    newBadges.push(BADGES.PERFECT_ATTENDANCE);
  }
  if (student.attendance >= 90 && !earnedBadges.includes('Consistent Attendee')) {
    newBadges.push(BADGES.CONSISTENT_ATTENDEE);
  }

  // Check academic badges
  if (student.currentGPA >= 3.5 && !earnedBadges.includes('Honor Roll')) {
    newBadges.push(BADGES.HONOR_ROLL);
  }

  // Check streak badges
  if (student.streak >= 7 && !earnedBadges.includes('Week Warrior')) {
    newBadges.push(BADGES.WEEK_WARRIOR);
  }
  if (student.streak >= 30 && !earnedBadges.includes('Monthly Master')) {
    newBadges.push(BADGES.MONTHLY_MASTER);
  }

  return newBadges;
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (students, type = 'points') => {
  return students
    .map(student => ({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      avatar: student.avatar,
      points: calculatePoints(student.badges || []),
      level: getLevel(calculatePoints(student.badges || [])),
      streak: student.streak || 0,
      gpa: student.currentGPA
    }))
    .sort((a, b) => {
      switch (type) {
        case 'streak':
          return b.streak - a.streak;
        case 'gpa':
          return b.gpa - a.gpa;
        default:
          return b.points - a.points;
      }
    })
    .slice(0, 10)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
};

export default {
  getAllBadges,
  getBadgeByName,
  calculatePoints,
  getLevel,
  getGamificationProfile,
  checkBadgeEligibility,
  getLeaderboard
};
