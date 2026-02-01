import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../../config/index.js';
import { User } from '../models/User.model.js';
import { AppError, catchAsync } from '../middleware/error.middleware.js';

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

// Send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  
  // Remove password from output
  const { password, ...userData } = user;

  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = catchAsync(async (req, res, next) => {
  const { email, password, firstName, lastName, role } = req.body;

  // Check if user exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new AppError('User already exists with this email', 400));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role: role || 'student'
  });

  createSendToken(user, 201, res);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Demo login - allow any credentials for testing
  // In production, you would validate against the database
  
  // Check for demo accounts
  if (email === 'demo@gradevision.edu' || email === 'admin@gradevision.edu') {
    const demoUser = {
      id: 'demo-user-id',
      email: email,
      firstName: email === 'admin@gradevision.edu' ? 'Admin' : 'Demo',
      lastName: 'User',
      role: email === 'admin@gradevision.edu' ? 'admin' : 'student',
      avatar: null
    };
    
    return createSendToken(demoUser, 200, res);
  }

  // Check for existing user
  const user = await User.findByEmail(email);
  
  if (!user) {
    // For demo purposes, create a temporary user
    const demoUser = {
      id: `user-${Date.now()}`,
      email: email,
      firstName: 'User',
      lastName: '',
      role: 'student',
      avatar: null
    };
    return createSendToken(demoUser, 200, res);
  }

  // In production, verify password
  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) {
  //   return next(new AppError('Invalid credentials', 401));
  // }

  createSendToken(user, 200, res);
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = catchAsync(async (req, res, next) => {
  const { password, ...user } = req.user;
  
  res.status(200).json({
    success: true,
    user
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = catchAsync(async (req, res, next) => {
  const { firstName, lastName, avatar } = req.body;

  const updatedUser = await User.update(req.user.id, {
    firstName,
    lastName,
    avatar
  });

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  const { password, ...userData } = updatedUser;

  res.status(200).json({
    success: true,
    user: userData
  });
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});
