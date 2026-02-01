/**
 * AI Prediction Service
 * Simulates ML model predictions for student performance
 * In production, this would integrate with TensorFlow.js or a Python microservice
 */

// Feature weights for the prediction model (simplified)
const FEATURE_WEIGHTS = {
  attendance: 0.25,
  currentGPA: 0.30,
  studyHours: 0.15,
  assignmentCompletion: 0.20,
  streak: 0.10
};

// Risk thresholds
const RISK_THRESHOLDS = {
  low: 0.7,
  medium: 0.5,
  high: 0
};

/**
 * Predict student performance
 * @param {Object} studentData - Student metrics
 * @returns {Object} Prediction results
 */
export const predictPerformance = (studentData) => {
  const {
    attendance = 0,
    currentGPA = 0,
    studyHours = 0,
    assignmentsCompleted = 0,
    totalAssignments = 1,
    streak = 0
  } = studentData;

  // Normalize features (0-1 scale)
  const normalizedFeatures = {
    attendance: attendance / 100,
    currentGPA: currentGPA / 4.0,
    studyHours: Math.min(studyHours / 40, 1), // 40 hours as max
    assignmentCompletion: assignmentsCompleted / totalAssignments,
    streak: Math.min(streak / 30, 1) // 30 days as max
  };

  // Calculate weighted score
  let performanceScore = 0;
  for (const [feature, weight] of Object.entries(FEATURE_WEIGHTS)) {
    performanceScore += normalizedFeatures[feature] * weight;
  }

  // Add some variance for realism
  const variance = (Math.random() - 0.5) * 0.05;
  performanceScore = Math.max(0, Math.min(1, performanceScore + variance));

  // Determine risk level
  let riskLevel = 'high';
  if (performanceScore >= RISK_THRESHOLDS.low) {
    riskLevel = 'low';
  } else if (performanceScore >= RISK_THRESHOLDS.medium) {
    riskLevel = 'medium';
  }

  // Predict future GPA
  const predictedGPA = Math.round(performanceScore * 4 * 100) / 100;

  // Calculate confidence
  const confidence = Math.round((0.75 + Math.random() * 0.2) * 100);

  // Feature importance for explainability
  const featureImportance = calculateFeatureImportance(normalizedFeatures);

  return {
    performanceScore: Math.round(performanceScore * 100),
    predictedGPA,
    riskLevel,
    confidence,
    featureImportance,
    trend: calculateTrend(studentData.performanceHistory || [])
  };
};

/**
 * Calculate feature importance for explainable AI
 */
const calculateFeatureImportance = (features) => {
  const importance = [];
  
  for (const [feature, value] of Object.entries(features)) {
    const contribution = value * FEATURE_WEIGHTS[feature];
    importance.push({
      feature: formatFeatureName(feature),
      value: Math.round(value * 100),
      weight: FEATURE_WEIGHTS[feature],
      contribution: Math.round(contribution * 100),
      impact: contribution > 0.15 ? 'high' : contribution > 0.08 ? 'medium' : 'low'
    });
  }

  return importance.sort((a, b) => b.contribution - a.contribution);
};

/**
 * Format feature name for display
 */
const formatFeatureName = (feature) => {
  const names = {
    attendance: 'Attendance Rate',
    currentGPA: 'Current GPA',
    studyHours: 'Weekly Study Hours',
    assignmentCompletion: 'Assignment Completion',
    streak: 'Learning Streak'
  };
  return names[feature] || feature;
};

/**
 * Calculate performance trend
 */
const calculateTrend = (history) => {
  if (!history || history.length < 2) return 'stable';
  
  const recent = history.slice(-3);
  const firstGPA = recent[0]?.gpa || 0;
  const lastGPA = recent[recent.length - 1]?.gpa || 0;
  const diff = lastGPA - firstGPA;

  if (diff > 0.1) return 'improving';
  if (diff < -0.1) return 'declining';
  return 'stable';
};

/**
 * Generate personalized study recommendations
 */
export const generateRecommendations = (studentData, prediction) => {
  const recommendations = [];
  const { featureImportance } = prediction;

  // Find weak areas
  const weakAreas = featureImportance.filter(f => f.value < 70);

  weakAreas.forEach(area => {
    switch (area.feature) {
      case 'Attendance Rate':
        recommendations.push({
          category: 'Attendance',
          priority: 'high',
          title: 'Improve Attendance',
          description: 'Your attendance is below optimal. Try to attend all classes to improve understanding and grades.',
          actionItems: [
            'Set daily reminders for classes',
            'Identify and address barriers to attendance',
            'Connect with classmates for notes when absent'
          ]
        });
        break;
      case 'Weekly Study Hours':
        recommendations.push({
          category: 'Study Habits',
          priority: 'medium',
          title: 'Increase Study Time',
          description: 'Consider dedicating more time to studying. Aim for at least 25 hours per week.',
          actionItems: [
            'Create a structured study schedule',
            'Use the Pomodoro technique',
            'Find a quiet study environment'
          ]
        });
        break;
      case 'Assignment Completion':
        recommendations.push({
          category: 'Assignments',
          priority: 'high',
          title: 'Complete All Assignments',
          description: 'Completing assignments is crucial for understanding and grades.',
          actionItems: [
            'Use a task manager to track deadlines',
            'Break large assignments into smaller tasks',
            'Start assignments early'
          ]
        });
        break;
      case 'Learning Streak':
        recommendations.push({
          category: 'Consistency',
          priority: 'low',
          title: 'Build Learning Habits',
          description: 'Consistent daily learning helps retention and understanding.',
          actionItems: [
            'Study a little bit every day',
            'Review notes within 24 hours of class',
            'Practice spaced repetition'
          ]
        });
        break;
    }
  });

  // Add general recommendations based on risk level
  if (prediction.riskLevel === 'high') {
    recommendations.unshift({
      category: 'Urgent',
      priority: 'critical',
      title: 'Seek Academic Support',
      description: 'Your performance indicators suggest you may benefit from additional support.',
      actionItems: [
        'Schedule a meeting with your academic advisor',
        'Consider tutoring services',
        'Form a study group with peers'
      ]
    });
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
};

/**
 * Generate explainable AI insights in simple language
 */
export const generateInsights = (studentData, prediction) => {
  const insights = [];
  const { performanceScore, riskLevel, featureImportance, trend } = prediction;

  // Overall performance insight
  if (performanceScore >= 80) {
    insights.push({
      type: 'positive',
      title: 'Excellent Performance',
      message: `You're performing in the top tier! Your predicted GPA of ${prediction.predictedGPA} reflects your hard work.`
    });
  } else if (performanceScore >= 60) {
    insights.push({
      type: 'neutral',
      title: 'Good Progress',
      message: `You're on a solid track with a ${performanceScore}% performance score. Small improvements can push you to the next level.`
    });
  } else {
    insights.push({
      type: 'warning',
      title: 'Attention Needed',
      message: `Your current performance score of ${performanceScore}% indicates you may need additional support to succeed.`
    });
  }

  // Trend insight
  if (trend === 'improving') {
    insights.push({
      type: 'positive',
      title: 'Upward Trend',
      message: 'Your grades have been improving over the past few months. Keep up the great work!'
    });
  } else if (trend === 'declining') {
    insights.push({
      type: 'warning',
      title: 'Declining Trend',
      message: 'Your performance has been declining recently. Let\'s identify what\'s causing this and address it.'
    });
  }

  // Top contributing factor
  const topFactor = featureImportance[0];
  if (topFactor) {
    insights.push({
      type: 'info',
      title: 'Key Factor',
      message: `${topFactor.feature} is the biggest contributor to your current performance, accounting for ${topFactor.contribution}% of your score.`
    });
  }

  // Weakest area
  const weakestFactor = featureImportance[featureImportance.length - 1];
  if (weakestFactor && weakestFactor.value < 70) {
    insights.push({
      type: 'suggestion',
      title: 'Area for Improvement',
      message: `Focusing on improving your ${weakestFactor.feature.toLowerCase()} could significantly boost your overall performance.`
    });
  }

  return insights;
};

export default {
  predictPerformance,
  generateRecommendations,
  generateInsights
};
