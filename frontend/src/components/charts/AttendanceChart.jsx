import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const AttendanceChart = ({ data, height = 300 }) => {
  const { darkMode } = useTheme();
  
  const colors = {
    bar: '#3b82f6',
    grid: darkMode ? '#374151' : '#e5e7eb',
    text: darkMode ? '#9ca3af' : '#6b7280'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-2xl font-bold text-primary-600 mt-1">
          {payload[0].value}%
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
        <XAxis
          dataKey="month"
          stroke={colors.text}
          tick={{ fill: colors.text }}
          axisLine={{ stroke: colors.grid }}
        />
        <YAxis
          stroke={colors.text}
          tick={{ fill: colors.text }}
          axisLine={{ stroke: colors.grid }}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="average"
          fill={colors.bar}
          radius={[4, 4, 0, 0]}
          maxBarSize={50}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
