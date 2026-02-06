import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  BookOpen,
  Calendar
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import PerformanceChart from '../components/charts/PerformanceChart';
import AttendanceChart from '../components/charts/AttendanceChart';
import RiskDistributionChart from '../components/charts/RiskDistributionChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { analyticsAPI } from '../services/api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [dashRes, trendsRes, attendanceRes, riskRes, subjectsRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getPerformanceTrends(),
        analyticsAPI.getAttendance(),
        analyticsAPI.getRiskDistribution(),
        analyticsAPI.getSubjectPerformance()
      ]);
      
      setDashboardData(dashRes.data.data);
      setTrends(trendsRes.data.data || []);
      setAttendance(attendanceRes.data.data);
      setRiskData(riskRes.data.data);
      setSubjectPerformance(subjectsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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

  // Transform trends data for chart
  const performanceData = trends.map(t => ({
    month: t.month,
    gpa: t.averageGPA,
    attendance: t.averageAttendance
  }));

  const kpiCards = [
    {
      title: 'Average GPA',
      value: dashboardData?.averageGPA?.toFixed(2) || '3.42',
      change: '+0.2',
      icon: Target,
      description: 'Class average performance'
    },
    {
      title: 'Attendance Rate',
      value: `${attendance?.averageAttendance || 85}%`,
      change: '+3%',
      icon: Calendar,
      description: 'Overall attendance'
    },
    {
      title: 'Students at Risk',
      value: riskData?.distribution?.high || 1,
      change: '-1',
      icon: Users,
      description: 'Need intervention'
    },
    {
      title: 'Improving',
      value: '65%',
      change: '+8%',
      icon: TrendingUp,
      description: 'Students improving'
    }
  ];

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
            <BarChart3 className="w-8 h-8 text-primary-600" />
            Analytics Dashboard
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into student performance and trends.
          </p>
        </div>
        
        {/* Timeframe Selector */}
        <div className="mt-4 md:mt-0 flex gap-2">
          {['weekly', 'monthly', 'yearly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                  <kpi.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <span className={`text-sm font-medium ${
                  kpi.change.startsWith('+') ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-sm text-gray-600 dark:text-gray-400">{kpi.title}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {kpi.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {kpi.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={performanceData} height={300} />
          </CardContent>
        </Card>

        {/* Attendance Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Attendance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceChart data={attendance?.monthlyTrend || []} height={300} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart 
              data={riskData?.distribution || { low: 3, medium: 1, high: 1 }} 
              height={250} 
            />
            <div className="mt-4 space-y-2">
              {['low', 'medium', 'high'].map(level => (
                <div key={level} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-gray-600 dark:text-gray-400">
                    {level} Risk
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {riskData?.percentages?.[level] || 0}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectPerformance.map((subject, index) => (
                <motion.div
                  key={subject.subject}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-32 text-sm font-medium text-gray-900 dark:text-white truncate">
                    {subject.subject}
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.avgScore}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          subject.avgScore >= 80 ? 'bg-success-500' :
                          subject.avgScore >= 60 ? 'bg-warning-500' : 'bg-danger-500'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {subject.avgScore}%
                    </span>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Pass: {subject.passRate}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {attendance?.distribution && Object.entries(attendance.distribution).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${
                  key === 'excellent' ? 'bg-success-100 dark:bg-success-900/30' :
                  key === 'good' ? 'bg-primary-100 dark:bg-primary-900/30' :
                  key === 'average' ? 'bg-warning-100 dark:bg-warning-900/30' :
                  'bg-danger-100 dark:bg-danger-900/30'
                }`}
              >
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {key}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {value.count} students
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {value.min}-{value.max}% attendance
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
