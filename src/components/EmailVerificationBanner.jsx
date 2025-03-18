import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resendVerificationEmail } from '../services/authService';
import { clearError } from '../features/auth/authSlice';

const EmailVerificationBanner = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  const [resendStatus, setResendStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
  
  // Don't show banner if user is not logged in or email is already verified
  if (!user || user.emailVerified || !user.email) {
    return null;
  }
  
  const handleResendVerification = async () => {
    setResendStatus({
      loading: true,
      success: false,
      error: null
    });
    
    try {
      await resendVerificationEmail();
      setResendStatus({
        loading: false,
        success: true,
        error: null
      });
      
      // Clear the banner after 5 seconds
      setTimeout(() => {
        setResendStatus({
          loading: false,
          success: false,
          error: null
        });
      }, 5000);
      
    } catch (error) {
      setResendStatus({
        loading: false,
        success: false,
        error: error.response?.data?.message || 'Failed to resend verification email. Please try again later.'
      });
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setResendStatus({
          loading: false,
          success: false,
          error: null
        });
        dispatch(clearError());
      }, 5000);
    }
  };
  
  return (
    <div className="alert alert-warning mb-4">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Your email address is not verified. Please check your inbox or spam folder for the verification email.
        </div>
        <div className="ms-3">
          {resendStatus.loading ? (
            <button className="btn btn-sm btn-warning" disabled>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Sending...
            </button>
          ) : (
            <button 
              className="btn btn-sm btn-warning" 
              onClick={handleResendVerification}
              disabled={resendStatus.success}
            >
              Resend Email
            </button>
          )}
        </div>
      </div>
      
      {resendStatus.success && (
        <div className="alert alert-success mt-2 mb-0">
          Verification email sent successfully! Please check your inbox.
        </div>
      )}
      
      {resendStatus.error && (
        <div className="alert alert-danger mt-2 mb-0">
          {resendStatus.error}
        </div>
      )}
    </div>
  );
};

export default EmailVerificationBanner;