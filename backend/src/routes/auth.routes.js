import express from 'express';
import {
  register, login, logout, getMe, updateProfile, changePassword,
  sendOtp, verifyOtp, resetPassword
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  validateRegister, validateLogin, validateSendOtp, validateVerifyOtp, validateResetPassword
} from '../middleware/validation.middleware.js';

const router = express.Router();

// Public routes
router.post('/send-otp', validateSendOtp, sendOtp);
router.post('/verify-otp', validateVerifyOtp, verifyOtp);
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/reset-password', validateResetPassword, resetPassword);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.post('/logout', logout);

export default router;
