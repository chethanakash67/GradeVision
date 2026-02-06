import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const FeatureImportanceChart = ({ data, height = 300 }) => {
  const { darkMode } = useTheme();

  const chartData = data?.map(item => ({
    feature: item.feature,
    value: item.value,
    fullMark: 100
  })) || [];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">
          {data.feature}
        </p>
        <p className="text-2xl font-bold text-primary-600 mt-1">
          {data.value}%
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={chartData}>
        <PolarGrid
          stroke={darkMode ? '#374151' : '#e5e7eb'}
        />
        <PolarAngleAxis
          dataKey="feature"
          tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          name="Performance"
          dataKey="value"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default FeatureImportanceChart;
