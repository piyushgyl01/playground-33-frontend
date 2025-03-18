import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/authService';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    success: false,
    error: null
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyEmailToken = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (!token) {
        setVerificationStatus({
          loading: false,
          success: false,
          error: 'Verification token is missing. Please check your email for the correct verification link.'
        });
        return;
      }
      
      try {
        await verifyEmail(token);
        setVerificationStatus({
          loading: false,
          success: true,
          error: null
        });
        
        // After successful verification, redirect to login after a delay
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Email verified successfully! You can now log in.' 
            } 
          });
        }, 3000);
      } catch (error) {
        setVerificationStatus({
          loading: false,
          success: false,
          error: error.response?.data?.message || 'Email verification failed. The token may be invalid or expired.'
        });
      }
    };
    
    verifyEmailToken();
  }, [location.search, navigate]);
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <h2 className="mb-4">Email Verification</h2>
              
              {verificationStatus.loading && (
                <div>
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Verifying your email address...</p>
                </div>
              )}
              
              {verificationStatus.success && (
                <div className="alert alert-success">
                  <h4 className="alert-heading">Email Verified!</h4>
                  <p>Your email has been successfully verified.</p>
                  <p className="mb-0">You will be redirected to the login page in a few seconds...</p>
                </div>
              )}
              
              {verificationStatus.error && (
                <div className="alert alert-danger">
                  <h4 className="alert-heading">Verification Failed</h4>
                  <p>{verificationStatus.error}</p>
                  <hr />
                  <p className="mb-0">
                    <Link to="/login" className="alert-link">Return to login</Link> or try again later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;