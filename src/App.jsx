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
          
          {/* Job Routes - some public, some protected */}
          <Route path="/" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/jobs/create" element={<CreateJob />} />
            <Route path="/jobs/edit/:jobId" element={<EditJob />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;