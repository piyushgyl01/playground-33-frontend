import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { oauthLoginSuccess } from '../features/auth/authSlice';

const OAuthCallback = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const userJson = params.get('user');
        const provider = params.get('provider');

        if (!userJson) {
          setError('Authentication failed. User data not received.');
          return;
        }

        // Parse user data
        let user;
        try {
          user = userJson ? JSON.parse(decodeURIComponent(userJson)) : null;
          
          // Ensure provider is part of the user object
          if (user && provider && !user.provider) {
            user.provider = provider;
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
          setError('Error processing user data.');
          return;
        }

        // Update Redux state
        dispatch(oauthLoginSuccess(user));

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    handleOAuthCallback();
  }, [dispatch, location, navigate]);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
        <div className="text-center mt-3">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 text-center">
      <h2>Completing Authentication</h2>
      <p>Please wait while we complete the authentication process...</p>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default OAuthCallback;
