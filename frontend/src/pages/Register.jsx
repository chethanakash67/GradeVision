import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, GraduationCap, Eye, EyeOff, User, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const OTP_LENGTH = 6;

// ── OTP Input Component ──────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, char) => {
    if (!/^\d?$/.test(char)) return; // digits only
    const arr = value.split('');
    arr[index] = char;
    const newVal = arr.join('').slice(0, OTP_LENGTH);
    onChange(newVal);
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    onChange(pasted);
    const nextIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIdx]?.focus();
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
            text-gray-900 dark:text-white transition-all"
        />
      ))}
    </div>
  );
};

// ── Main Register Component ──────────────────────────────────────
const Register = () => {
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Resend cooldown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1 → send OTP
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await authAPI.sendOtp({ email: formData.email, purpose: 'signup' });
      setSuccess('Verification code sent to your email!');
      setResendTimer(60);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → verify OTP → register
  const handleVerifyOtp = async () => {
    if (otp.length < OTP_LENGTH) {
      return setError('Please enter the full 6-digit code');
    }
    setError('');
    setLoading(true);
    try {
      await authAPI.verifyOtp({ email: formData.email, code: otp, purpose: 'signup' });

      // OTP verified — now register
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setError('');
    setOtp('');
    setLoading(true);
    try {
      const res = await authAPI.sendOtp({ email: formData.email, purpose: 'signup' });
      setSuccess('New code sent!');
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  // ── Left branding panel (shared) ──
  const BrandPanel = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-secondary-700 p-12 flex-col justify-between">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Grade Vision</span>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-md">
        <h1 className="text-4xl font-bold text-white mb-6">Join Grade Vision Today</h1>
        <p className="text-xl text-white/80 mb-8">Create your account and start tracking student performance with AI-powered insights.</p>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Predictive Analytics', icon: '📊' },
            { label: 'Real-time Alerts', icon: '🔔' },
            { label: 'Explainable AI', icon: '🧠' },
            { label: 'Gamification', icon: '🏆' },
          ].map((f, i) => (
            <motion.div key={f.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }} className="flex items-center gap-3 text-white/90">
              <span className="text-2xl">{f.icon}</span>
              <span className="font-medium">{f.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }} className="text-white/60 text-sm">
        © 2026 Grade Vision. All rights reserved.
      </motion.p>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <BrandPanel />

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Grade Vision</span>
          </div>

          <AnimatePresence mode="wait">
            {/* ──────── STEP 1: Registration Form ──────── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Sign up to get started with Grade Vision</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg">
                      <p className="text-sm text-danger-700 dark:text-danger-400">{error}</p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" type="text" name="firstName" icon={User} placeholder="John" value={formData.firstName} onChange={handleChange} required />
                    <Input label="Last Name"  type="text" name="lastName"  icon={User} placeholder="Doe"  value={formData.lastName}  onChange={handleChange} required />
                  </div>

                  <Input label="Email Address" type="email" name="email" icon={Mail} placeholder="you@example.com" value={formData.email} onChange={handleChange} required />

                  <div className="relative">
                    <Input label="Password" type={showPassword ? 'text' : 'password'} name="password" icon={Lock} placeholder="Create a password" value={formData.password} onChange={handleChange} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" icon={Lock} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex items-center">
                    <input type="checkbox" id="terms" required className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      I agree to the{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">Terms of Service</a>{' '}and{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">Privacy Policy</a>
                    </label>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                    Continue
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">Sign in</Link>
                </p>
              </motion.div>
            )}

            {/* ──────── STEP 2: OTP Verification ──────── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => { setStep(1); setError(''); setOtp(''); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="text-center mb-8">
                  <div className="inline-flex p-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-4">
                    <ShieldCheck className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify your email</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    We sent a 6-digit code to <span className="font-medium text-gray-900 dark:text-white">{formData.email}</span>
                  </p>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg mb-6">
                    <p className="text-sm text-danger-700 dark:text-danger-400">{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg mb-6">
                    <p className="text-sm text-success-700 dark:text-success-400">{success}</p>
                  </motion.div>
                )}

                <OtpInput value={otp} onChange={setOtp} />

                <Button onClick={handleVerifyOtp} variant="primary" size="lg" className="w-full mt-6" loading={loading} disabled={otp.length < OTP_LENGTH}>
                  Verify & Create Account
                </Button>

                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  {resendTimer > 0 ? (
                    <>Resend code in <span className="font-medium text-gray-900 dark:text-white">{resendTimer}s</span></>
                  ) : (
                    <>
                      Didn't receive the code?{' '}
                      <button onClick={handleResend} disabled={loading} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                        Resend
                      </button>
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
