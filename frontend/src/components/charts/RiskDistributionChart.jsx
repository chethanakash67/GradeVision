import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444'
};

const RiskDistributionChart = ({ data, height = 300 }) => {
  const chartData = [
    { name: 'Low Risk', value: data?.low || 0, color: COLORS.low },
    { name: 'Medium Risk', value: data?.medium || 0, color: COLORS.medium },
    { name: 'High Risk', value: data?.high || 0, color: COLORS.high }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0];
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="text-gray-900 dark:text-white font-medium">
            {data.name}
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {data.value} students
        </p>
      </div>
    );
  };

  const CustomLegend = ({ payload }) => (
    <div className="flex justify-center gap-6 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RiskDistributionChart;
