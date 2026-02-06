import { motion } from 'framer-motion';

const ProgressBar = ({ 
  current, 
  max, 
  label, 
  showPercentage = true,
  color = 'primary',
  size = 'md',
  animated = true 
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-500',
    danger: 'bg-danger-600',
    secondary: 'bg-secondary-600'
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`${colors[color]} ${sizes[size]} rounded-full`}
        />
      </div>
      {current !== undefined && max !== undefined && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {current} / {max}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
