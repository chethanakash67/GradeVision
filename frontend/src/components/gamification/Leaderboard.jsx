import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Leaderboard = ({ data = [], currentUserId }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">{rank}</span>;
    }
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-success-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-danger-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-3">
      {data.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            flex items-center gap-4 p-4 rounded-xl transition-all duration-200
            ${entry.id === currentUserId
              ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500'
              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          {/* Rank */}
          <div className="flex-shrink-0 w-8">
            {getRankIcon(entry.rank)}
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white font-semibold">
              {entry.name?.split(' ').map(n => n[0]).join('')}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {entry.name}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Level {entry.level?.level || 1}</span>
              <span>•</span>
              <span>{entry.badges || 0} badges</span>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-white">
                {entry.score}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
            </div>
            {getChangeIcon(entry.change)}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Leaderboard;
