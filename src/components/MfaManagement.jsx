import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { disableMfa } from '../services/authService';
import { updateUserProfile } from '../features/auth/authSlice';
import MfaForm from './MfaForm';

const MfaManagement = ({ user }) => {
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    mfaToken: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // If user has no email verified, show warning
  const showEmailWarning = user.email && !user.emailVerified;
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error on input change
    if (status.error) {
      setStatus({ ...status, error: null });
    }
  };
  
  const handleMfaCodeSubmit = (code) => {
    setFormData({
      ...formData,
      mfaToken: code
    });
  };
  
  const handleDisableMfa = async (e) => {
    e.preventDefault();
    
    setStatus({
      loading: true,
      error: null
    });
    
    try {
      await disableMfa({
        password: formData.password,
        mfaToken: formData.mfaToken
      });
      
      // Update user in Redux store
      dispatch(updateUserProfile({
        ...user,
        mfaEnabled: false
      }));
      
      // Show success and redirect
      navigate('/profile', { 
        state: { message: 'Two-factor authentication has been disabled successfully.' } 
      });
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || 'Failed to disable MFA. Please try again.'
      });
    }
  };
  
  if (!user) {
    return null;
  }
  
  if (showEmailWarning) {
    return (
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h5 className="card-title">Two-Factor Authentication</h5>
        <div className="alert alert-warning">
          You need to verify your email address before enabling two-factor authentication.
        </div>
      </div>
    );
  }
  
  return (
    <div className="card shadow-sm border-0 p-4 mb-4">
      <h5 className="card-title">Two-Factor Authentication</h5>
      
      {user.mfaEnabled ? (
        <>
          <p className="mb-3">
            <span className="badge bg-success me-2">Enabled</span>
            Your account is protected with two-factor authentication.
          </p>
          
          {!showDisableForm ? (
            <button 
              className="btn btn-danger"
              onClick={() => setShowDisableForm(true)}
            >
              Disable Two-Factor Authentication
            </button>
          ) : (
            <div className="mt-3">
              <div className="alert alert-warning">
                <strong>Warning:</strong> Disabling two-factor authentication will make your account less secure.
              </div>
              
              {status.error && (
                <div className="alert alert-danger mb-3">
                  {status.error}
                </div>
              )}
              
              <form onSubmit={handleDisableMfa}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Confirm your password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={status.loading}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="mfaToken" className="form-label">Verification code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="mfaToken"
                    name="mfaToken"
                    value={formData.mfaToken}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit code from your app"
                    maxLength="6"
                    pattern="[0-9]{6}"
                    required
                    disabled={status.loading}
                  />
                  <div className="form-text">
                    Enter a code from your authenticator app or use one of your backup codes.
                  </div>
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={status.loading}
                  >
                    {status.loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Disabling...
                      </>
                    ) : 'Disable Two-Factor Authentication'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowDisableForm(false)}
                    disabled={status.loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="mb-3">
            <span className="badge bg-warning text-dark me-2">Disabled</span>
            Two-factor authentication is not enabled for your account.
          </p>
          <p className="mb-3">
            Enhance your account security by enabling two-factor authentication.
            This adds an extra layer of protection by requiring a verification code 
            from your authenticator app when you sign in.
          </p>
          <Link to="/mfa/setup" className="btn btn-primary">
            Set Up Two-Factor Authentication
          </Link>
        </>
      )}
    </div>
  );
};

export default MfaManagement;