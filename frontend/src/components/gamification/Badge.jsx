import { motion } from 'framer-motion';

const Badge = ({ badge, earned = false, size = 'md' }) => {
  const sizes = {
    sm: { container: 'w-12 h-12', icon: 'text-xl', name: 'text-xs' },
    md: { container: 'w-16 h-16', icon: 'text-2xl', name: 'text-sm' },
    lg: { container: 'w-20 h-20', icon: 'text-3xl', name: 'text-base' }
  };

  const sizeConfig = sizes[size];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className={`
          ${sizeConfig.container}
          rounded-full flex items-center justify-center
          transition-all duration-300
          ${earned
            ? 'bg-gradient-to-br from-primary-500 to-secondary-600 shadow-glow'
            : 'bg-gray-200 dark:bg-gray-700 grayscale opacity-50'
          }
        `}
      >
        <span className={sizeConfig.icon}>
          {badge.icon || '🏅'}
        </span>
      </div>
      <div className="text-center">
        <p className={`${sizeConfig.name} font-medium text-gray-900 dark:text-white`}>
          {badge.name}
        </p>
        {earned && badge.points && (
          <p className="text-xs text-primary-600 dark:text-primary-400">
            +{badge.points} pts
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Badge;
