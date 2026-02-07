import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, GraduationCap, ArrowLeft, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';
import { authAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

/* ─── OTP Input Component ─── */
const OtpInput = ({ value, onChange, disabled }) => {
  const inputsRef = useRef([]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;
    const newOtp = value.split('');
    newOtp[index] = val.slice(-1);
    const otpString = newOtp.join('');
    onChange(otpString);
    if (val && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      onChange(pasted.padEnd(6, ''));
      inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl
            bg-white dark:bg-gray-800
            border-gray-300 dark:border-gray-600
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
            text-gray-900 dark:text-white
            disabled:opacity-50 transition-all"
        />
      ))}
    </div>
  );
};

/* ─── Forgot Password Page ─── */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password, 4: success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  /* ── Step 1: Send OTP to email ── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authAPI.sendOtp({ email, purpose: 'forgot-password' });
      setResendTimer(60);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Verify OTP ── */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await authAPI.verifyOtp({ email, code: otp, purpose: 'forgot-password' });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3: Reset password ── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await authAPI.resetPassword({ email, code: otp, newPassword: password });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend OTP ── */
  const handleResendOtp = useCallback(async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError('');
    setOtp('');

    try {
      const res = await authAPI.sendOtp({ email, purpose: 'forgot-password' });
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  }, [email, resendTimer]);

  /* ── Slide animation variants ── */
  const slideVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-secondary-700 p-12 flex-col justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Grade Vision</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md"
        >
          <ShieldCheck className="w-16 h-16 text-white/80 mb-6" />
          <h1 className="text-4xl font-bold text-white mb-6">Reset Your Password</h1>
          <p className="text-xl text-white/80">
            No worries! We will send you a verification code to your email address so you can securely reset your password.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-white/60 text-sm"
        >
          © 2026 Grade Vision. All rights reserved.
        </motion.p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Grade Vision</span>
          </div>

          {/* Step indicator */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      s < step
                        ? 'bg-success-500 text-white'
                        : s === step
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {s < step ? '✓' : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-12 h-0.5 ${
                        s < step ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ────────── STEP 1: Enter Email ────────── */}
            {step === 1 && (
              <motion.div key="step-email" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Enter your email and we will send you a verification code
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg"
                    >
                      <p className="text-sm text-danger-700 dark:text-danger-400">{error}</p>
                    </motion.div>
                  )}

                  <Input
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                    Send Verification Code
                  </Button>
                </form>

                <p className="mt-6 text-center">
                  <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium inline-flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ────────── STEP 2: Verify OTP ────────── */}
            {step === 2 && (
              <motion.div key="step-otp" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Verify Code</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Enter the 6-digit code sent to <strong>{email}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg"
                    >
                      <p className="text-sm text-danger-700 dark:text-danger-400">{error}</p>
                    </motion.div>
                  )}

                  <OtpInput value={otp} onChange={setOtp} disabled={loading} />

                  <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading} disabled={otp.replace(/\s/g, '').length < 6}>
                    Verify Code
                  </Button>

                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Resend code in <span className="font-medium text-primary-600 dark:text-primary-400">{resendTimer}s</span>
                      </p>
                    ) : (
                      <button type="button" onClick={handleResendOtp} disabled={loading} className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                        Resend Code
                      </button>
                    )}
                  </div>
                </form>

                <p className="mt-6 text-center">
                  <button type="button" onClick={() => { setStep(1); setError(''); setOtp(''); }} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 inline-flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Change email
                  </button>
                </p>
              </motion.div>
            )}

            {/* ────────── STEP 3: New Password ────────── */}
            {step === 3 && (
              <motion.div key="step-password" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">New Password</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Create a strong new password for your account
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg"
                    >
                      <p className="text-sm text-danger-700 dark:text-danger-400">{error}</p>
                    </motion.div>
                  )}

                  <div className="relative">
                    <Input
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      icon={Lock}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <Input
                    label="Confirm Password"
                    type="password"
                    icon={Lock}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  {/* Password strength hints */}
                  <div className="space-y-2">
                    {[
                      { label: 'At least 6 characters', met: password.length >= 6 },
                      { label: 'Passwords match', met: password && password === confirmPassword },
                    ].map((rule) => (
                      <div key={rule.label} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${rule.met ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                          {rule.met && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className={rule.met ? 'text-success-600 dark:text-success-400' : 'text-gray-500 dark:text-gray-400'}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading} disabled={password.length < 6 || password !== confirmPassword}>
                    Reset Password
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ────────── STEP 4: Success ────────── */}
            {step === 4 && (
              <motion.div key="step-success" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-success-600 dark:text-success-400" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Password Reset!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Go to Sign In
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
