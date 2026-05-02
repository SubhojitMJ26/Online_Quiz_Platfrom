import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';

// User pages
import QuizList from './pages/QuizList';
import TakeQuiz from './pages/TakeQuiz';
import PublicLeaderboard from './pages/Leaderboard';

// 👇 NEW: Student Dashboard
import StudentDashboard from './pages/StudentDashboard'; // 👈 ADD THIS IMPORT

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />; // 👈 Fixed redirect
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 👇 STUDENT DASHBOARD ROUTES */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />

        {/* User Routes (redirect to dashboard) */}
        <Route 
          path="/quizzes" 
          element={<Navigate to="/dashboard/exams" />} 
        />
        <Route 
          path="/quiz/:id" 
          element={
            <ProtectedRoute>
              <TakeQuiz />
            </ProtectedRoute>
          } 
        />
        <Route path="/leaderboard" element={<PublicLeaderboard />} />

        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;