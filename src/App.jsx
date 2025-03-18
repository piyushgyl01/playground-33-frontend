import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import OAuthCallback from './components/OAuthCallback';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Job pages
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import JobDetailPage from './pages/JobDetailPage';

// Authentication-related pages
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MfaSetup from './pages/MfaSetup';

function App() {
  const dispatch = useDispatch();
  
  // Check for existing authentication on app load
  useEffect(() => {
    dispatch(getCurrentUser()).catch(() => {
      // Silently handle error - user is not authenticated
    });
  }, [dispatch]);
  
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/success" element={<OAuthCallback />} />
          
          {/* Authentication-related public routes */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Job Routes - some public, some protected */}
          <Route path="/" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/jobs/create" element={<CreateJob />} />
            <Route path="/jobs/edit/:jobId" element={<EditJob />} />
            <Route path="/mfa/setup" element={<MfaSetup />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;