const getRiskColor = (risk) => {
  switch (risk) {
    case 'low':
      return {
        bg: 'bg-success-100 dark:bg-success-900/30',
        text: 'text-success-700 dark:text-success-400',
        border: 'border-success-200 dark:border-success-800',
        dot: 'bg-success-500'
      };
    case 'medium':
      return {
        bg: 'bg-warning-100 dark:bg-warning-900/30',
        text: 'text-warning-700 dark:text-warning-400',
        border: 'border-warning-200 dark:border-warning-800',
        dot: 'bg-warning-500'
      };
    case 'high':
      return {
        bg: 'bg-danger-100 dark:bg-danger-900/30',
        text: 'text-danger-700 dark:text-danger-400',
        border: 'border-danger-200 dark:border-danger-800',
        dot: 'bg-danger-500'
      };
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-600',
        dot: 'bg-gray-500'
      };
  }
};

const RiskBadge = ({ risk, showDot = true, size = 'md', className = '' }) => {
  const colors = getRiskColor(risk);
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full capitalize
        ${colors.bg} ${colors.text}
        ${sizes[size]}
        ${className}
      `}
    >
      {showDot && (
        <span className={`w-2 h-2 rounded-full mr-1.5 ${colors.dot}`} />
      )}
      {risk} Risk
    </span>
  );
};

export default RiskBadge;
