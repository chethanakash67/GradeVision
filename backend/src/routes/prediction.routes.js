import express from 'express';
import {
  getPrediction,
  getBatchPredictions,
  getRecommendations,
  getExplainableInsights,
  getFeatureImportance
} from '../controllers/prediction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Individual prediction
router.get('/student/:id', getPrediction);

// Batch predictions
router.get('/batch', getBatchPredictions);

// AI recommendations
router.get('/recommendations/:id', getRecommendations);

// Explainable AI
router.get('/explain/:id', getExplainableInsights);
router.get('/feature-importance/:id', getFeatureImportance);

export default router;
