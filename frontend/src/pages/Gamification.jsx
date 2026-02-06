import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Flame, Star, Medal, Crown, Target } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Badge from '../components/gamification/Badge';
import StreakCounter from '../components/gamification/StreakCounter';
import ProgressBar from '../components/gamification/ProgressBar';
import Leaderboard from '../components/gamification/Leaderboard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { gamificationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Gamification = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [streak, setStreak] = useState(null);
  const [progress, setProgress] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      const userId = user?.id || 'demo-user-id';
      const [badgesRes, leaderboardRes, streakRes, progressRes, achievementsRes] = await Promise.all([
        gamificationAPI.getBadges(userId),
        gamificationAPI.getLeaderboard(),
        gamificationAPI.getStreak(userId),
        gamificationAPI.getProgress(userId),
        gamificationAPI.getAchievements(userId)
      ]);
      
      setBadges(badgesRes.data.data || []);
      setLeaderboard(leaderboardRes.data.data?.leaderboard || []);
      setStreak(streakRes.data.data);
      setProgress(progressRes.data.data);
      setAchievements(achievementsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const earnedBadges = badges.filter(b => b.earned);
  const availableBadges = badges.filter(b => !b.earned);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
          >
            <Trophy className="w-8 h-8 text-warning-500" />
            Gamification
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track achievements, badges, and compete on the leaderboard.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['overview', 'badges', 'leaderboard', 'achievements'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap capitalize
              ${activeTab === tab
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Level & Progress */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning-500" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-warning-400 to-warning-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {progress?.level || 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {progress?.rank || 'Beginner'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {progress?.totalXp || 0} total XP earned
                    </p>
                    <div className="mt-3">
                      <ProgressBar
                        current={progress?.xp || 0}
                        max={progress?.xpToNextLevel || 100}
                        label="XP to next level"
                        color="warning"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
                    <Award className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {earnedBadges.length}
                    </p>
                    <p className="text-sm text-gray-500">Badges Earned</p>
                  </div>
                  <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-xl">
                    <Target className="w-6 h-6 text-success-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {achievements?.completed?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500">Achievements</p>
                  </div>
                  <div className="p-4 bg-secondary-50 dark:bg-secondary-900/30 rounded-xl">
                    <Crown className="w-6 h-6 text-secondary-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      #{leaderboard.find(l => l.id === user?.id)?.rank || '-'}
                    </p>
                    <p className="text-sm text-gray-500">Rank</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Streak */}
            <div>
              <StreakCounter
                streak={streak?.currentStreak || 0}
                longestStreak={streak?.longestStreak || 0}
                weeklyActivity={streak?.weeklyActivity || []}
              />
            </div>
          </div>

          {/* Recent Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                {earnedBadges.slice(0, 6).map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge badge={badge} earned={true} />
                  </motion.div>
                ))}
                {earnedBadges.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No badges earned yet. Keep learning to unlock achievements!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'badges' && (
        <div className="space-y-6">
          {/* Earned Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-warning-500" />
                Earned Badges ({earnedBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {earnedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge badge={badge} earned={true} />
                  </motion.div>
                ))}
              </div>
              {earnedBadges.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No badges earned yet. Start completing tasks to earn badges!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Available Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-gray-400" />
                Available Badges ({availableBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {availableBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge badge={badge} earned={false} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning-500" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Leaderboard data={leaderboard} currentUserId={user?.id} />
          </CardContent>
        </Card>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* Completed */}
          {achievements?.completed?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-success-600">✅ Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.completed.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {achievement.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                      <span className="text-success-600 font-medium">+{achievement.points} pts</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* In Progress */}
          {achievements?.inProgress?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-warning-600">🔄 In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.inProgress.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {achievement.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {achievement.description}
                        </p>
                        <ProgressBar
                          current={achievement.progress}
                          max={100}
                          size="sm"
                          color="warning"
                          showPercentage={false}
                        />
                      </div>
                      <span className="text-gray-500">{achievement.progress}%</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Locked */}
          {achievements?.locked?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-400">🔒 Locked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements.locked.slice(0, 6).map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg opacity-60"
                    >
                      <span className="text-2xl grayscale">{achievement.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {achievement.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Gamification;
