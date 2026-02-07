import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Award,
  Bell,
  ChevronRight,
  Brain,
  Target,
  Zap
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import RiskBadge from '../components/common/RiskBadge';
import PerformanceChart from '../components/charts/PerformanceChart';
import RiskDistributionChart from '../components/charts/RiskDistributionChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { analyticsAPI, alertsAPI, studentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, alertsRes, studentsRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        alertsAPI.getAll({ limit: 5 }),
        studentsAPI.getAll()
      ]);
      setStats(statsRes.data.data);
      setAlerts(alertsRes.data.data?.alerts || []);
      setStudents(studentsRes.data.data || []);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Don't call logout here - let the API interceptor and AuthContext handle 401s.
      // Calling logout() here causes a race condition where the user gets redirected
      // to login even when the token is valid (e.g., if the backend is temporarily down).
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        return;
      }
      setError('Failed to load dashboard data. Please check if the server is running.');
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || students.length,
      change: '+12%',
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Average GPA',
      value: stats?.averageGPA?.toFixed(2) || '3.42',
      change: '+0.3',
      icon: TrendingUp,
      color: 'success'
    },
    {
      title: 'At Risk',
      value: stats?.riskDistribution?.high || 1,
      change: '-2',
      icon: AlertTriangle,
      color: 'danger'
    },
    {
      title: 'Active Badges',
      value: '24',
      change: '+5',
      icon: Award,
      color: 'secondary'
    }
  ];

  const colorClasses = {
    primary: {
      bg: 'bg-primary-100 dark:bg-primary-900/30',
      icon: 'text-primary-600 dark:text-primary-400'
    },
    success: {
      bg: 'bg-success-100 dark:bg-success-900/30',
      icon: 'text-success-600 dark:text-success-400'
    },
    danger: {
      bg: 'bg-danger-100 dark:bg-danger-900/30',
      icon: 'text-danger-600 dark:text-danger-400'
    },
    warning: {
      bg: 'bg-warning-100 dark:bg-warning-900/30',
      icon: 'text-warning-600 dark:text-warning-400'
    },
    secondary: {
      bg: 'bg-secondary-100 dark:bg-secondary-900/30',
      icon: 'text-secondary-600 dark:text-secondary-400'
    }
  };

  // Sample performance data for chart
  const performanceData = [
    { month: 'Sep', gpa: 3.3, attendance: 92 },
    { month: 'Oct', gpa: 3.4, attendance: 89 },
    { month: 'Nov', gpa: 3.5, attendance: 91 },
    { month: 'Dec', gpa: 3.6, attendance: 88 },
    { month: 'Jan', gpa: 3.7, attendance: 90 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
          >
            Welcome back, {user?.firstName || 'User'}! 👋
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your students today.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {alerts.filter(a => !a.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 rounded-full text-xs text-white flex items-center justify-center">
                {alerts.filter(a => !a.read).length}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-2 ${
                    stat.change.startsWith('+') ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[stat.color].bg}`}>
                  <stat.icon className={`w-6 h-6 ${colorClasses[stat.color].icon}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={performanceData} height={280} />
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart 
              data={stats?.riskDistribution || { low: 3, medium: 1, high: 1 }} 
              height={280} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Alerts
            </CardTitle>
            <a href="/alerts" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.slice(0, 4).map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex items-start gap-3 p-3 rounded-lg transition-colors
                    ${alert.read 
                      ? 'bg-gray-50 dark:bg-gray-700/50' 
                      : 'bg-primary-50 dark:bg-primary-900/20'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-lg flex-shrink-0
                    ${alert.severity === 'high' 
                      ? 'bg-danger-100 dark:bg-danger-900/30' 
                      : alert.severity === 'medium'
                        ? 'bg-warning-100 dark:bg-warning-900/30'
                        : 'bg-success-100 dark:bg-success-900/30'
                    }
                  `}>
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.severity === 'high' 
                        ? 'text-danger-600' 
                        : alert.severity === 'medium'
                          ? 'text-warning-600'
                          : 'text-success-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {alert.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {alert.message}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card gradient>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  icon: Target,
                  title: 'Performance Prediction',
                  description: '78% of students are on track to improve their GPA this semester.',
                  color: 'success'
                },
                {
                  icon: AlertTriangle,
                  title: 'Attention Needed',
                  description: '2 students show signs of declining engagement. Early intervention recommended.',
                  color: 'warning'
                },
                {
                  icon: Zap,
                  title: 'Trending Up',
                  description: 'Overall class attendance has improved by 5% this month.',
                  color: 'primary'
                }
              ].map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg"
                >
                  <div className={`
                    p-2 rounded-lg flex-shrink-0
                    ${colorClasses[insight.color].bg}
                  `}>
                    <insight.icon className={`w-4 h-4 ${colorClasses[insight.color].icon}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {insight.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {insight.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Students Overview</CardTitle>
          <a href="/students" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </a>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Grade</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">GPA</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Attendance</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-xs font-medium">
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{student.grade}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {student.currentGPA?.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.attendance >= 90 ? 'bg-success-500' :
                              student.attendance >= 75 ? 'bg-warning-500' : 'bg-danger-500'
                            }`}
                            style={{ width: `${student.attendance}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {student.attendance}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge risk={student.riskLevel} size="sm" />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
