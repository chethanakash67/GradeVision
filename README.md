# 🎓 Grade Vision

AI-powered student performance prediction platform with real-time analytics, explainable insights, and gamification features.

![Grade Vision](https://img.shields.io/badge/Grade-Vision-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 📊 Dashboard
- Real-time student performance overview
- Key metrics (total students, at-risk count, average GPA, attendance)
- Performance trends visualization
- Risk distribution charts
- Recent alerts and AI insights

### 🔮 AI Predictions
- ML-powered performance predictions
- Risk level assessment (Low/Medium/High)
- Confidence scores
- Explainable AI with feature importance
- Personalized recommendations

### 📈 Analytics
- Performance trends over time
- Attendance tracking
- Subject-wise performance
- Class comparisons
- Risk distribution analysis

### 👥 Student Management
- Student directory with search & filters
- Individual student profiles
- Performance tracking
- Risk indicators
- Badge collections

### 🎮 Gamification
- Achievement badges (16+ unique badges)
- Learning streaks
- XP & leveling system
- Leaderboards
- Progress tracking

### 🌙 Modern UI/UX
- Light/Dark mode toggle
- Responsive design (mobile-friendly)
- Smooth animations (Framer Motion)
- Card-based layouts
- Interactive charts (Recharts)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/grade-vision.git
   cd grade-vision
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd ../backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

5. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm run dev
   # App runs on http://localhost:5173
   ```

6. **Open the application**
   Navigate to `http://localhost:5173` in your browser.

### Demo Login
Use the demo credentials to explore the application:
- **Email:** demo@gradevision.edu
- **Password:** demo123

## 🏗️ Project Structure

```
grade-vision/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── app.js           # Express app configuration
│   ├── config/              # Configuration files
│   └── server.js            # Server entry point
│
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Buttons, Cards, Inputs, etc.
│   │   │   ├── charts/      # Recharts components
│   │   │   └── gamification/# Badges, Progress, Leaderboard
│   │   ├── context/         # React Context (Auth, Theme)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── styles/          # Global styles
│   │   └── App.jsx          # Main app component
│   └── index.html           # HTML entry point
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/trends` - Performance trends
- `GET /api/analytics/attendance` - Attendance data
- `GET /api/analytics/risk` - Risk distribution
- `GET /api/analytics/subjects` - Subject performance

### Predictions
- `GET /api/predictions/:studentId` - Get prediction
- `GET /api/predictions/:studentId/insights` - Explainable AI insights
- `GET /api/predictions/:studentId/recommendations` - AI recommendations

### Gamification
- `GET /api/gamification/badges` - All badges
- `GET /api/gamification/leaderboard` - Leaderboard
- `GET /api/gamification/streak` - Current streak
- `GET /api/gamification/achievements` - User achievements

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts & visualizations
- **Framer Motion** - Animations
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin support

## 🎨 Theme Colors

| Color | Light | Dark |
|-------|-------|------|
| Primary | `#4F46E5` | `#6366F1` |
| Secondary | `#8B5CF6` | `#A78BFA` |
| Success | `#10B981` | `#34D399` |
| Warning | `#F59E0B` | `#FBBF24` |
| Danger | `#EF4444` | `#F87171` |

## 📱 Responsive Design

Grade Vision is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1280px+)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet security headers
- Input validation
- CORS configuration

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Design inspired by modern education platforms
- Charts powered by Recharts
- Icons by Lucide React
- Animations by Framer Motion

---

Built with ❤️ by the Grade Vision Team
