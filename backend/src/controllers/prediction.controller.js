import { Student } from '../models/Student.model.js';
import predictionService from '../services/prediction.service.js';
import { AppError, catchAsync } from '../middleware/error.middleware.js';

/**
 * @desc    Get prediction for a student
 * @route   GET /api/predictions/:studentId
 * @access  Private
 */
export const getStudentPrediction = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.studentId);

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  const prediction = predictionService.predictPerformance(student);
  const recommendations = predictionService.generateRecommendations(student, prediction);
  const insights = predictionService.generateInsights(student, prediction);

  res.status(200).json({
    success: true,
    data: {
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        grade: student.grade
      },
      prediction,
      recommendations,
      insights
    }
  });
});

/**
 * @desc    Get predictions for all students
 * @route   GET /api/predictions
 * @access  Private
 */
export const getAllPredictions = catchAsync(async (req, res, next) => {
  const students = await Student.findAll();

  const predictions = students.map(student => {
    const prediction = predictionService.predictPerformance(student);
    return {
      studentId: student.id,
      name: `${student.firstName} ${student.lastName}`,
      grade: student.grade,
      section: student.section,
      currentGPA: student.currentGPA,
      prediction: {
        performanceScore: prediction.performanceScore,
        predictedGPA: prediction.predictedGPA,
        riskLevel: prediction.riskLevel,
        trend: prediction.trend,
        confidence: prediction.confidence
      }
    };
  });

  // Summary statistics
  const summary = {
    totalStudents: predictions.length,
    riskDistribution: {
      low: predictions.filter(p => p.prediction.riskLevel === 'low').length,
      medium: predictions.filter(p => p.prediction.riskLevel === 'medium').length,
      high: predictions.filter(p => p.prediction.riskLevel === 'high').length
    },
    averagePredictedGPA: Math.round(
      (predictions.reduce((sum, p) => sum + p.prediction.predictedGPA, 0) / predictions.length) * 100
    ) / 100,
    trendDistribution: {
      improving: predictions.filter(p => p.prediction.trend === 'improving').length,
      stable: predictions.filter(p => p.prediction.trend === 'stable').length,
      declining: predictions.filter(p => p.prediction.trend === 'declining').length
    }
  };

  res.status(200).json({
    success: true,
    data: {
      predictions,
      summary
    }
  });
});

/**
 * @desc    Get risk analysis
 * @route   GET /api/predictions/risk/analysis
 * @access  Private
 */
export const getRiskAnalysis = catchAsync(async (req, res, next) => {
  const students = await Student.findAll();

  const riskAnalysis = students.map(student => {
    const prediction = predictionService.predictPerformance(student);
    return {
      studentId: student.id,
      name: `${student.firstName} ${student.lastName}`,
      riskLevel: prediction.riskLevel,
      performanceScore: prediction.performanceScore,
      keyRiskFactors: prediction.featureImportance
        .filter(f => f.value < 70)
        .map(f => f.feature),
      attendance: student.attendance,
      currentGPA: student.currentGPA,
      trend: prediction.trend
    };
  });

  // Group by risk level
  const grouped = {
    high: riskAnalysis.filter(s => s.riskLevel === 'high'),
    medium: riskAnalysis.filter(s => s.riskLevel === 'medium'),
    low: riskAnalysis.filter(s => s.riskLevel === 'low')
  };

  res.status(200).json({
    success: true,
    data: {
      analysis: riskAnalysis,
      grouped,
      summary: {
        highRiskCount: grouped.high.length,
        mediumRiskCount: grouped.medium.length,
        lowRiskCount: grouped.low.length,
        interventionNeeded: grouped.high.length
      }
    }
  });
});

/**
 * @desc    Get feature importance explanation
 * @route   GET /api/predictions/:studentId/explain
 * @access  Private
 */
export const explainPrediction = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.studentId);

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  const prediction = predictionService.predictPerformance(student);
  const insights = predictionService.generateInsights(student, prediction);

  // Generate detailed explanation
  const explanation = {
    summary: `Based on our AI analysis, ${student.firstName} has a ${prediction.performanceScore}% performance score with a ${prediction.riskLevel} risk level.`,
    factors: prediction.featureImportance.map(factor => ({
      name: factor.feature,
      value: `${factor.value}%`,
      impact: factor.impact,
      explanation: getFactorExplanation(factor)
    })),
    confidence: `Our model is ${prediction.confidence}% confident in this prediction.`,
    methodology: 'This prediction is based on a weighted analysis of attendance, GPA, study habits, and engagement metrics.',
    insights
  };

  res.status(200).json({
    success: true,
    data: explanation
  });
});

// Helper function to generate factor explanations
const getFactorExplanation = (factor) => {
  const explanations = {
    'Attendance Rate': factor.value >= 90 
      ? 'Excellent attendance is strongly contributing to success.' 
      : factor.value >= 70 
        ? 'Attendance is adequate but could be improved.'
        : 'Low attendance is negatively impacting performance.',
    'Current GPA': factor.value >= 80
      ? 'Strong academic performance is a key strength.'
      : factor.value >= 60
        ? 'Academic performance is average with room for improvement.'
        : 'Academic struggles are a primary concern.',
    'Weekly Study Hours': factor.value >= 70
      ? 'Good study habits are paying off.'
      : 'Increasing study time could significantly improve results.',
    'Assignment Completion': factor.value >= 80
      ? 'Completing assignments consistently is helping.'
      : 'Missing assignments is hurting the grade.',
    'Learning Streak': factor.value >= 70
      ? 'Consistent engagement shows strong commitment.'
      : 'Building consistent learning habits would help.'
  };

  return explanations[factor.feature] || 'This factor contributes to the overall prediction.';
};
