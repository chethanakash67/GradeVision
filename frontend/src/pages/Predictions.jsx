import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  AlertCircle,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import RiskBadge from '../components/common/RiskBadge';
import FeatureImportanceChart from '../components/charts/FeatureImportanceChart';
import ProgressBar from '../components/gamification/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { predictionsAPI, studentsAPI } from '../services/api';

const Predictions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      const studentList = response.data.data || [];
      setStudents(studentList);
      
      if (studentList.length > 0) {
        await selectStudent(studentList[0]);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectStudent = async (student) => {
    setSelectedStudent(student);
    try {
      const [predRes, insightsRes] = await Promise.all([
        predictionsAPI.getStudentPrediction(student.id),
        predictionsAPI.getExplainableInsights(student.id)
      ]);
      setPrediction(predRes.data.data?.prediction);
      setInsights(insightsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch prediction:', error);
    }
  };

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
            <Brain className="w-8 h-8 text-primary-600" />
            AI Predictions
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered performance predictions with explainable insights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Student Selector */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Student</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => selectStudent(student)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                    ${selectedStudent?.id === student.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-xs font-medium">
                    {student.firstName?.[0]}{student.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-gray-500">Grade {student.grade}</p>
                  </div>
                  <RiskBadge risk={student.riskLevel} size="sm" showDot={false} />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prediction Details */}
        <div className="lg:col-span-3 space-y-6">
          {selectedStudent && prediction && (
            <>
              {/* Student Summary */}
              <Card gradient>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-xl font-bold">
                    {selectedStudent.firstName?.[0]}{selectedStudent.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Grade {selectedStudent.grade} • Section {selectedStudent.section}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Performance Score</p>
                      <p className="text-3xl font-bold text-primary-600">
                        {prediction.performanceScore}%
                      </p>
                    </div>
                    <RiskBadge risk={prediction.riskLevel} size="lg" />
                  </div>
                </div>
              </Card>

              {/* Prediction Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Predicted GPA</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {prediction.predictedGPA?.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {prediction.trend === 'improving' ? (
                        <TrendingUp className="w-4 h-4 text-success-500" />
                      ) : prediction.trend === 'declining' ? (
                        <TrendingDown className="w-4 h-4 text-danger-500" />
                      ) : null}
                      <span className={`text-sm capitalize ${
                        prediction.trend === 'improving' ? 'text-success-500' :
                        prediction.trend === 'declining' ? 'text-danger-500' :
                        'text-gray-500'
                      }`}>
                        {prediction.trend}
                      </span>
                    </div>
                  </div>
                </Card>
                
                <Card>
                  <div className="text-center">
                    <Brain className="w-8 h-8 text-secondary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Confidence</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {prediction.confidence}%
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Model certainty</p>
                  </div>
                </Card>

                <Card>
                  <div className="text-center">
                    <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${
                      prediction.riskLevel === 'high' ? 'text-danger-500' :
                      prediction.riskLevel === 'medium' ? 'text-warning-500' :
                      'text-success-500'
                    }`} />
                    <p className="text-sm text-gray-500">Risk Level</p>
                    <p className={`text-3xl font-bold capitalize ${
                      prediction.riskLevel === 'high' ? 'text-danger-500' :
                      prediction.riskLevel === 'medium' ? 'text-warning-500' :
                      'text-success-500'
                    }`}>
                      {prediction.riskLevel}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {prediction.riskLevel === 'high' ? 'Needs attention' :
                       prediction.riskLevel === 'medium' ? 'Monitor closely' :
                       'On track'}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Feature Importance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-warning-500" />
                    Feature Importance (Explainable AI)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FeatureImportanceChart data={prediction.featureImportance} height={250} />
                    <div className="space-y-4">
                      {prediction.featureImportance?.map((feature, index) => (
                        <motion.div
                          key={feature.feature}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {feature.feature}
                            </span>
                            <span className={`text-sm font-semibold ${
                              feature.impact === 'high' ? 'text-success-600' :
                              feature.impact === 'medium' ? 'text-warning-600' :
                              'text-danger-600'
                            }`}>
                              {feature.value}%
                            </span>
                          </div>
                          <ProgressBar
                            current={feature.value}
                            max={100}
                            showPercentage={false}
                            size="sm"
                            color={
                              feature.value >= 70 ? 'success' :
                              feature.value >= 50 ? 'warning' : 'danger'
                            }
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              {insights?.insights && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                      AI Insights & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Summary */}
                      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <p className="text-gray-900 dark:text-white">
                          {insights.explanation || `Based on our AI analysis, ${selectedStudent.firstName} has a ${prediction.performanceScore}% performance score with a ${prediction.riskLevel} risk level.`}
                        </p>
                      </div>

                      {/* Detailed Insights */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.insights?.map((insight, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`
                              p-4 rounded-lg flex items-start gap-3
                              ${insight.type === 'positive' 
                                ? 'bg-success-50 dark:bg-success-900/20' 
                                : insight.type === 'negative'
                                  ? 'bg-danger-50 dark:bg-danger-900/20'
                                  : 'bg-warning-50 dark:bg-warning-900/20'
                              }
                            `}
                          >
                            {insight.type === 'positive' ? (
                              <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                            ) : insight.type === 'negative' ? (
                              <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Lightbulb className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                            )}
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {insight.message}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictions;
