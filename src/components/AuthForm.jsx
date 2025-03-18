import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, loginUser, clearError } from '../features/auth/authSlice';
import { getGoogleAuthUrl, getGithubAuthUrl } from '../services/authService';

const AuthForm = ({ isLogin = true }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  // Clear errors when component unmounts or form type changes
  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, isLogin]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setFormError('');
  };

  const validateForm = () => {
    // Basic form validation
    if (isLogin) {
      if (!formData.username || !formData.password) {
        setFormError('Please fill in all required fields');
        return false;
      }
    } else {
      if (!formData.name || !formData.username || !formData.password || !formData.confirmPassword) {
        setFormError('Please fill in all required fields');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setFormError('Passwords do not match');
        return false;
      }
      
      if (formData.password.length < 8) {
        setFormError('Password must be at least 8 characters long');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isLogin) {
        await dispatch(loginUser({
          username: formData.username,
          password: formData.password
        })).unwrap();
      } else {
        await dispatch(registerUser({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          email: formData.email || undefined
        })).unwrap();
        
        // If registration is successful, redirect to login
        navigate('/login');
      }
    } catch (error) {
      // Error is handled by the reducer
      console.error('Authentication error:', error);
    }
  };

  // Handle OAuth login
  const handleOAuthLogin = (provider) => {
    if (provider === 'google') {
      window.location.href = getGoogleAuthUrl();
    } else if (provider === 'github') {
      window.location.href = getGithubAuthUrl();
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <h3 className="text-center mb-4">
        {isLogin ? 'Login' : 'Create Account'}
      </h3>
      
      {(formError || error) && (
        <div className="alert alert-danger">
          {formError || error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
        )}
        
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        {!isLogin && (
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email (optional)</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        )}
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        {!isLogin && (
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
        )}
        
        <div className="d-grid gap-2 mb-3">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </>
            ) : (
              isLogin ? 'Login' : 'Create Account'
            )}
          </button>
        </div>
      </form>
      
      <div className="text-center mb-3">
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? "/register" : "/login"}>
            {isLogin ? "Register" : "Login"}
          </Link>
        </p>
      </div>
      
      <div className="text-center">
        <p className="text-muted mb-3">OR CONTINUE WITH</p>
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-outline-danger"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
          >
            Google
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
          >
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
