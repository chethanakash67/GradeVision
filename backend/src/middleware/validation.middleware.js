import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './error.middleware.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg).join(', ');
    return next(new AppError(messages, 400));
  }
  next();
};

export const validateRegister = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  validate
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

export const validateSendOtp = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('purpose')
    .isIn(['signup', 'forgot-password'])
    .withMessage('Purpose must be signup or forgot-password'),
  validate
];

export const validateVerifyOtp = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('code')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits'),
  body('purpose')
    .isIn(['signup', 'forgot-password'])
    .withMessage('Purpose must be signup or forgot-password'),
  validate
];

export const validateResetPassword = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  validate
];

export const authValidation = {
  register: validateRegister,
  login: validateLogin
};

export const studentValidation = {
  create: [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('grade').notEmpty().withMessage('Grade is required'),
    validate
  ],
  update: [
    param('id').notEmpty().withMessage('Student ID is required'),
    validate
  ]
};
