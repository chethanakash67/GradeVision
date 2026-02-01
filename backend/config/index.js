import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/grade-vision',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
