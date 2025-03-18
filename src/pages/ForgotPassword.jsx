import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus({
        loading: false,
        success: false,
        error: 'Please enter your email address'
      });
      return;
    }
    
    setStatus({
      loading: true,
      success: false,
      error: null
    });
    
    try {
      await forgotPassword(email);
      setStatus({
        loading: false,
        success: true,
        error: null
      });
    } catch (error) {
      // For security, don't reveal if the email exists or not
      // Instead, always show a success message
      setStatus({
        loading: false,
        success: true,
        error: null
      });
      
      // Just log the error for debugging
      console.error('Password reset request error:', error);
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Reset Password</h2>
              
              {status.success ? (
                <div className="alert alert-success">
                  <h4 className="alert-heading">Check Your Email</h4>
                  <p>
                    If an account exists with the email <strong>{email}</strong>,
                    we've sent instructions on how to reset your password.
                  </p>
                  <hr />
                  <p className="mb-0">
                    Please check your inbox and spam folder. The reset link will expire in 1 hour.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-muted mb-4">
                    Enter your email address below and we'll send you instructions to reset your password.
                  </p>
                  
                  {status.error && (
                    <div className="alert alert-danger">{status.error}</div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status.loading}
                        required
                      />
                    </div>
                    
                    <div className="d-grid mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status.loading}
                      >
                        {status.loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending Request...
                          </>
                        ) : 'Reset Password'}
                      </button>
                    </div>
                  </form>
                </>
              )}
              
              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none">
                  &larr; Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;