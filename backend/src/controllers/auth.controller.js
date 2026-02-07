import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../../config/index.js';
import { User } from '../models/User.model.js';
import { Otp } from '../models/Otp.model.js';
import { sendOtpEmail } from '../services/email.service.js';
import { AppError, catchAsync } from '../middleware/error.middleware.js';

// ── Helpers ────────────────────────────────────────────────────────

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

const signToken = (id) =>
  jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpire });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const { password, loginAttempts, lockUntil, ...userData } = user;
  res.status(statusCode).json({ success: true, token, user: userData });
};

// ── Send OTP (signup / forgot-password) ────────────────────────────

/**
 * @route   POST /api/auth/send-otp
 * @body    { email, purpose }   purpose = 'signup' | 'forgot-password'
 */
export const sendOtp = catchAsync(async (req, res, next) => {
  const { email, purpose } = req.body;

  if (purpose === 'signup') {
    const existing = await User.findByEmail(email);
    if (existing) {
      return next(new AppError('User already exists with this email', 400));
    }
  }

  if (purpose === 'forgot-password') {
    if (['demo@gradevision.edu', 'admin@gradevision.edu'].includes(email)) {
      return next(new AppError('Password reset is not available for demo accounts', 400));
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return next(new AppError('No account found with this email', 404));
    }
  }

  const code = Otp.generate(email, purpose);
  await sendOtpEmail(email, code, purpose);

  res.status(200).json({
    success: true,
    message: `OTP sent to ${email}`,
  });
});

// ── Verify OTP ─────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/verify-otp
 * @body    { email, code, purpose }
 */
export const verifyOtp = catchAsync(async (req, res, next) => {
  const { email, code, purpose } = req.body;

  const result = Otp.verify(email, code, purpose);

  if (!result.valid) {
    return next(new AppError(result.reason, 400));
  }

  res.status(200).json({ success: true, message: 'OTP verified successfully' });
});

// ── Register (email must already be OTP-verified) ──────────────────

export const register = catchAsync(async (req, res, next) => {
  const { email, password, firstName, lastName, role } = req.body;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new AppError('User already exists with this email', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role: role || 'student',
    loginAttempts: 0,
    lockUntil: null,
  });

  createSendToken(user, 201, res);
});

// ── Login (with lockout) ───────────────────────────────────────────

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Demo accounts bypass everything
  if (email === 'demo@gradevision.edu') {
    return createSendToken(
      { id: 'demo-user-id', email, firstName: 'Demo', lastName: 'User', role: 'teacher', avatar: null },
      200, res
    );
  }
  if (email === 'admin@gradevision.edu') {
    return createSendToken(
      { id: 'admin-user-id', email, firstName: 'Admin', lastName: 'User', role: 'admin', avatar: null },
      200, res
    );
  }

  // Find user
  const user = await User.findByEmail(email);
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check lockout
  if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
    const mins = Math.ceil((new Date(user.lockUntil) - new Date()) / 60000);
    return next(
      new AppError(
        `Account is locked due to too many failed attempts. Try again in ${mins} minute${mins !== 1 ? 's' : ''}.`,
        423
      )
    );
  }

  // If lock has expired, reset counters
  if (user.lockUntil && new Date(user.lockUntil) <= new Date()) {
    await User.update(user.id, { loginAttempts: 0, lockUntil: null });
    user.loginAttempts = 0;
    user.lockUntil = null;
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const attempts = (user.loginAttempts || 0) + 1;
    const updates = { loginAttempts: attempts };

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      updates.lockUntil = new Date(Date.now() + LOCK_TIME_MS).toISOString();
      await User.update(user.id, updates);
      return next(
        new AppError(
          `Account locked after ${MAX_LOGIN_ATTEMPTS} failed attempts. Try again in 15 minutes.`,
          423
        )
      );
    }

    await User.update(user.id, updates);
    const remaining = MAX_LOGIN_ATTEMPTS - attempts;
    return next(
      new AppError(
        `Invalid password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining before account is locked.`,
        401
      )
    );
  }

  // Successful login — reset counters
  if (user.loginAttempts > 0) {
    await User.update(user.id, { loginAttempts: 0, lockUntil: null });
  }

  createSendToken(user, 200, res);
});

// ── Reset password (after OTP verified) ────────────────────────────

export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, newPassword } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.update(user.id, {
    password: hashedPassword,
    loginAttempts: 0,
    lockUntil: null,
  });

  res.status(200).json({ success: true, message: 'Password reset successfully' });
});

// ── Existing endpoints ─────────────────────────────────────────────

export const getMe = catchAsync(async (req, res) => {
  const { password, loginAttempts, lockUntil, ...user } = req.user;
  res.status(200).json({ success: true, user });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const { firstName, lastName, avatar } = req.body;
  const updatedUser = await User.update(req.user.id, { firstName, lastName, avatar });
  if (!updatedUser) return next(new AppError('User not found', 404));
  const { password, loginAttempts, lockUntil, ...userData } = updatedUser;
  res.status(200).json({ success: true, user: userData });
});

export const logout = catchAsync(async (_req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('User not found', 404));

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return next(new AppError('Current password is incorrect', 401));

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.update(user.id, { password: hashed });

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});
