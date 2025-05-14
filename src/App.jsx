import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/layout/Layout';
import AuthWrapper from './components/auth/AuthWrapper';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ProfileSetup from './components/profile/ProfileSetup';
import Profile from './components/profile/Profile';
import Dashboard from './components/dashboard/Dashboard';
import NutritionLog from './components/nutrition/NutritionLog';
import GoalsProgress from './components/goals/GoalsProgress';
import Achievements from './components/achievements/Achievements';
import ExerciseLibrary from './components/exercise/ExerciseLibrary';
import WorkoutPlans from './components/workout/WorkoutPlans';
import CalorieCalculator from './components/nutrition/CalorieCalculator';
import Settings from './components/settings/Settings';
import WorkoutTracker from './components/workout/WorkoutTracker';
import useStore from './store/useStore';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF4B2B',
    },
    secondary: {
      main: '#FF416C',
    },
    background: {
      default: '#121212',
      paper: '#1A1A1A',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
          color: '#ffffff',
        },
      },
    },
  },
});

const PublicRoute = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const user = useStore((state) => state.user);
  const location = useLocation();

  if (isAuthenticated) {
    // If user is authenticated but hasn't completed profile setup
    if (!user?.name) {
      return <Navigate to="/profile-setup" replace />;
    }
    // If user has completed profile setup, redirect to the intended page or dashboard
    const intendedPath = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={intendedPath} replace />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const user = useStore((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only force profile setup if user is authenticated but hasn't completed profile
  if (!user?.name && location.pathname !== '/profile-setup') {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthWrapper>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/profile-setup"
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />
            
            {/* Nested Protected Routes under Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/nutrition-log" element={<NutritionLog />} />
              <Route path="/goals-progress" element={<GoalsProgress />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/exercise-library" element={<ExerciseLibrary />} />
              <Route path="/workout-plans" element={<WorkoutPlans />} />
              <Route path="/calorie-calculator" element={<CalorieCalculator />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/workout-tracker" element={<WorkoutTracker />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthWrapper>
      </Router>
    </ThemeProvider>
  );
}
