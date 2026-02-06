import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const StreakCounter = ({ streak, longestStreak, weeklyActivity = [] }) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="bg-gradient-to-br from-warning-500 to-danger-500 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          >
            <Flame className="w-8 h-8" />
          </motion.div>
          <div>
            <p className="text-sm opacity-90">Current Streak</p>
            <p className="text-3xl font-bold">{streak} Days</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">Best Streak</p>
          <p className="text-xl font-semibold">{longestStreak} Days</p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="mt-4">
        <p className="text-sm opacity-90 mb-2">This Week</p>
        <div className="flex justify-between">
          {days.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${weeklyActivity[index]
                    ? 'bg-white/30'
                    : 'bg-white/10'
                  }
                `}
              >
                {weeklyActivity[index] && <Flame className="w-4 h-4" />}
              </motion.div>
              <span className="text-xs opacity-75">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;
