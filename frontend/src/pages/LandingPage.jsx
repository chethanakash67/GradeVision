import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  GraduationCap,
  Brain,
  BarChart3,
  Bell,
  Trophy,
  Shield,
  Users,
  TrendingUp,
  ChevronRight,
  Star,
  Zap,
  Target,
  ArrowRight,
  Menu,
  X,
  CheckCircle,
  Sparkles,
  LineChart,
  BookOpen,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ------------------------------------------------------------------ */
/*  Reusable tiny helpers                                              */
/* ------------------------------------------------------------------ */
const SectionTag = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
    <Sparkles className="w-3.5 h-3.5" />
    {children}
  </span>
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [.25,.46,.45,.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */
const Navbar = ({ user, logout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-glow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Grade<span className="text-gradient">Vision</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-primary-600 transition-colors">Testimonials</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors"
                >
                  Sign Out
                </button>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
        >
          <div className="px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Features</a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-gray-300">How It Works</a>
            <a href="#testimonials" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Testimonials</a>
            <hr className="border-gray-200 dark:border-gray-700" />
            {user ? (
              <>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300">Sign Out</button>
                <Link to="/dashboard" className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600">Go to Dashboard</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sign In</Link>
                <Link to="/register" className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600">Get Started Free</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
const Hero = ({ user }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-400/20 blur-3xl" />
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-secondary-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-success-400/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div style={{ y }} className="text-center max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <SectionTag>AI-Powered Education Analytics</SectionTag>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]"
          >
            Predict Student Success{' '}
            <span className="text-gradient">Before It Happens</span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            GradeVision uses advanced AI and machine learning to identify at-risk students early,
            provide actionable insights, and empower educators to make data-driven decisions.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-xl shadow-primary-500/25 transition-all hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
              >
                <LayoutDashboard className="w-5 h-5" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-xl shadow-primary-500/25 transition-all hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-200 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                >
                  View Demo
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </motion.div>

          {/* Trust bar */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500 dark:text-gray-400"
          >
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-success-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-success-500" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-success-500" /> Cancel anytime</span>
          </motion.div>
        </motion.div>

        {/* Hero dashboard mockup */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="mt-16 md:mt-20 mx-auto max-w-5xl"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* Mock browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger-400" />
                <div className="w-3 h-3 rounded-full bg-warning-400" />
                <div className="w-3 h-3 rounded-full bg-success-400" />
              </div>
              <div className="flex-1 ml-3 h-6 rounded-md bg-gray-200 dark:bg-gray-700 max-w-xs" />
            </div>
            {/* Mock dashboard content */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Students', val: '1,247', color: 'primary', icon: Users },
                  { label: 'Average GPA', val: '3.42', color: 'success', icon: TrendingUp },
                  { label: 'At Risk', val: '23', color: 'danger', icon: Bell },
                  { label: 'Predictions', val: '98.2%', color: 'secondary', icon: Brain },
                ].map((c) => (
                  <div key={c.label} className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <c.icon className={`w-4 h-4 text-${c.color}-500`} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{c.label}</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{c.val}</p>
                  </div>
                ))}
              </div>
              {/* Fake chart lines */}
              <div className="h-40 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 flex items-end px-6 pb-4 gap-3">
                {[40, 55, 45, 70, 60, 80, 75, 90, 85, 95, 88, 92].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: 0.8 + i * 0.06, ease: 'easeOut' }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-primary-500 to-primary-400 opacity-80"
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Glow behind card */}
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-success-500/20 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Logos / Stats strip                                                */
/* ------------------------------------------------------------------ */
const Stats = () => {
  const stats = [
    { value: '50K+', label: 'Students Tracked' },
    { value: '98.2%', label: 'Prediction Accuracy' },
    { value: '200+', label: 'Schools & Universities' },
    { value: '35%', label: 'Dropout Rate Reduced' },
  ];
  return (
    <section className="py-16 border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i}>
              <p className="text-3xl md:text-4xl font-extrabold text-gradient">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Features                                                           */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: Brain,
    title: 'AI-Powered Predictions',
    desc: 'Machine learning models analyse academic history, attendance, and engagement to forecast student performance with over 98% accuracy.',
    color: 'primary',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Interactive dashboards give educators instant visibility into class trends, risk distributions, and subject-level performance.',
    color: 'secondary',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    desc: "Automated notifications flag at-risk students the moment patterns shift — so you can intervene before it's too late.",
    color: 'danger',
  },
  {
    icon: Trophy,
    title: 'Gamification Engine',
    desc: 'Badges, streaks, and leaderboards keep students motivated and engaged in their own academic journey.',
    color: 'warning',
  },
  {
    icon: LineChart,
    title: 'Explainable AI',
    desc: 'Transparent models show exactly which factors drive each prediction — no black boxes, just actionable clarity.',
    color: 'success',
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    desc: 'Enterprise-grade encryption and role-based access ensure student data stays protected and compliant.',
    color: 'primary',
  },
];

const bgMap = {
  primary: 'bg-primary-100 dark:bg-primary-900/30',
  secondary: 'bg-secondary-100 dark:bg-secondary-900/30',
  success: 'bg-success-100 dark:bg-success-900/30',
  warning: 'bg-warning-100 dark:bg-warning-900/30',
  danger: 'bg-danger-100 dark:bg-danger-900/30',
};
const iconMap = {
  primary: 'text-primary-600 dark:text-primary-400',
  secondary: 'text-secondary-600 dark:text-secondary-400',
  success: 'text-success-600 dark:text-success-400',
  warning: 'text-warning-600 dark:text-warning-400',
  danger: 'text-danger-600 dark:text-danger-400',
};

const Features = () => (
  <section id="features" className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <motion.div variants={fadeUp}><SectionTag>Features</SectionTag></motion.div>
        <motion.h2 variants={fadeUp} className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Everything You Need to{' '}
          <span className="text-gradient">Empower Students</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-gray-600 dark:text-gray-400">
          A comprehensive toolkit that turns raw data into meaningful action — across every classroom, every student.
        </motion.p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            variants={fadeUp}
            custom={i}
            className="group relative p-6 md:p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`inline-flex p-3 rounded-xl ${bgMap[f.color]} mb-5`}>
              <f.icon className={`w-6 h-6 ${iconMap[f.color]}`} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  How It Works                                                       */
/* ------------------------------------------------------------------ */
const steps = [
  { num: '01', icon: BookOpen, title: 'Connect Your Data', desc: 'Import student records, attendance logs, and grades via CSV or integrate with your SIS.' },
  { num: '02', icon: Brain, title: 'AI Analyses Patterns', desc: 'Our models crunch thousands of data points to surface hidden trends and risk signals.' },
  { num: '03', icon: Target, title: 'Get Actionable Insights', desc: 'Receive clear predictions, ranked risk scores, and personalised intervention recommendations.' },
  { num: '04', icon: TrendingUp, title: 'Track & Improve', desc: 'Monitor progress in real-time, celebrate wins, and continuously refine your approach.' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 md:py-32 bg-white dark:bg-gray-800/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={stagger} initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <motion.div variants={fadeUp}><SectionTag>How It Works</SectionTag></motion.div>
        <motion.h2 variants={fadeUp} className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Up & Running in <span className="text-gradient">Minutes</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-gray-600 dark:text-gray-400">
          Four simple steps to transform the way you support your students.
        </motion.p>
      </motion.div>

      <motion.div
        variants={stagger} initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {steps.map((s, i) => (
          <motion.div key={s.num} variants={fadeUp} custom={i} className="relative text-center">
            {/* Connector line (hidden on first) */}
            {i > 0 && (
              <div className="hidden lg:block absolute top-10 -left-4 w-8 border-t-2 border-dashed border-primary-300 dark:border-primary-700" />
            )}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 text-white shadow-lg shadow-primary-500/25 mb-5">
              <s.icon className="w-7 h-7" />
            </div>
            <span className="block text-xs font-bold text-primary-500 mb-1">STEP {s.num}</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */
const testimonials = [
  {
    quote: "GradeVision helped us identify at-risk students weeks earlier than our old process. We've cut our dropout rate by almost 30%.",
    name: 'Dr. Sarah Mitchell',
    role: 'Dean of Academics, Riverside University',
    avatar: '👩‍🏫',
  },
  {
    quote: "The explainable AI insights are a game-changer. Teachers finally trust the data because they can see exactly why a student is flagged.",
    name: 'James Okafor',
    role: 'Head of Data, Lincoln Academy',
    avatar: '👨‍💻',
  },
  {
    quote: "Students love the gamification features — badges and streaks keep them engaged and accountable in a way grades alone never could.",
    name: 'Maria Gonzalez',
    role: '10th Grade Counsellor, Westfield High',
    avatar: '👩‍🎓',
  },
];

const Testimonials = () => (
  <section id="testimonials" className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={stagger} initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <motion.div variants={fadeUp}><SectionTag>Testimonials</SectionTag></motion.div>
        <motion.h2 variants={fadeUp} className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Loved by <span className="text-gradient">Educators Everywhere</span>
        </motion.h2>
      </motion.div>

      <motion.div
        variants={stagger} initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid md:grid-cols-3 gap-8"
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            variants={fadeUp}
            custom={i}
            className="relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-soft"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-warning-400 text-warning-400" />
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{t.avatar}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */
const CTA = ({ user }) => (
  <section className="py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-10 md:p-16 text-center"
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-secondary-400/20 blur-2xl" />

        <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
          Ready to Transform Student Outcomes?
        </h2>
        <p className="relative mt-4 text-lg text-primary-100 max-w-xl mx-auto">
          Join hundreds of institutions using GradeVision to support every learner. Set up in minutes — no engineering team required.
        </p>
        <div className="relative mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-primary-700 bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              Go to Dashboard
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-primary-700 bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl border-2 border-white/30 hover:bg-white/10 transition-all"
              >
                Sign In to Dashboard
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">GradeVision</span>
          </div>
          <p className="text-sm leading-relaxed">AI-powered student performance prediction and analytics platform for modern educators.</p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
            <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
        <p>&copy; {new Date().getFullYear()} GradeVision. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Built with ❤️ for educators and students</p>
      </div>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
/*  Page composition                                                   */
/* ------------------------------------------------------------------ */
const LandingPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar user={user} logout={logout} />
      <Hero user={user} />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA user={user} />
      <Footer />
    </div>
  );
};

export default LandingPage;
