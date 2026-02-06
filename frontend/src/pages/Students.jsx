import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import RiskBadge from '../components/common/RiskBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { studentsAPI } from '../services/api';

const Students = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = filterRisk === 'all' || student.riskLevel === filterRisk;
    const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
    
    return matchesSearch && matchesRisk && matchesGrade;
  });

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-success-500" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-danger-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const uniqueGrades = [...new Set(students.map(s => s.grade))].sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
          >
            <Users className="w-8 h-8 text-primary-600" />
            Students
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor student performance.
          </p>
        </div>
        <Button variant="primary" icon={Plus}>
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search students..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Grades</option>
              {uniqueGrades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: students.length, color: 'primary' },
          { label: 'Low Risk', value: students.filter(s => s.riskLevel === 'low').length, color: 'success' },
          { label: 'Medium Risk', value: students.filter(s => s.riskLevel === 'medium').length, color: 'warning' },
          { label: 'High Risk', value: students.filter(s => s.riskLevel === 'high').length, color: 'danger' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              p-4 rounded-xl text-center
              ${stat.color === 'primary' ? 'bg-primary-100 dark:bg-primary-900/30' :
                stat.color === 'success' ? 'bg-success-100 dark:bg-success-900/30' :
                stat.color === 'warning' ? 'bg-warning-100 dark:bg-warning-900/30' :
                'bg-danger-100 dark:bg-danger-900/30'
              }
            `}
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hover className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white font-semibold">
                    {student.firstName?.[0]}{student.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Grade {student.grade} • Section {student.section}
                    </p>
                  </div>
                </div>
                <RiskBadge risk={student.riskLevel} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">GPA</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {student.currentGPA?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {student.attendance}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Streak</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    🔥 {student.streak} days
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Badges</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {student.badges?.length || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  {getTrendIcon(student.trend || 'stable')}
                  <span className="capitalize">{student.trend || 'Stable'}</span>
                </div>
                <Button variant="ghost" size="sm" icon={Eye}>
                  View
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No students found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Students;
