import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/grade-vision',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  emailUser: process.env.EMAIL_USER,
  emailAppPassword: process.env.EMAIL_APP_PASSWORD,
};
