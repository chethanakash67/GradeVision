import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const PerformanceChart = ({ data, title, height = 300 }) => {
  const { darkMode } = useTheme();
  
  const colors = {
    gpa: '#3b82f6',
    attendance: '#10b981',
    grid: darkMode ? '#374151' : '#e5e7eb',
    text: darkMode ? '#9ca3af' : '#6b7280'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-300">{entry.name}:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {entry.name === 'GPA' ? entry.value.toFixed(2) : `${entry.value}%`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            dataKey="month"
            stroke={colors.text}
            tick={{ fill: colors.text }}
            axisLine={{ stroke: colors.grid }}
          />
          <YAxis
            yAxisId="left"
            stroke={colors.text}
            tick={{ fill: colors.text }}
            axisLine={{ stroke: colors.grid }}
            domain={[0, 4]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={colors.text}
            tick={{ fill: colors.text }}
            axisLine={{ stroke: colors.grid }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="gpa"
            name="GPA"
            stroke={colors.gpa}
            strokeWidth={3}
            dot={{ fill: colors.gpa, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="attendance"
            name="Attendance"
            stroke={colors.attendance}
            strokeWidth={3}
            dot={{ fill: colors.attendance, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
