import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setupMfa, verifyMfa } from '../services/authService';

const MfaSetup = () => {
  const [setupState, setSetupState] = useState({
    loading: true,
    error: null,
    step: 'generating', // generating, verifying, completed
    secret: null,
    qrCode: null,
    verificationCode: '',
    backupCodes: [],
  });
  
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    // If user already has MFA enabled, redirect to profile
    if (user?.mfaEnabled) {
      navigate('/profile', { 
        state: { message: 'MFA is already enabled for your account.' } 
      });
      return;
    }
    
    // Start MFA setup process
    const initMfaSetup = async () => {
      try {
        const response = await setupMfa();
        setSetupState({
          ...setupState,
          loading: false,
          step: 'verifying',
          secret: response.secret,
          qrCode: response.qrCode
        });
      } catch (error) {
        setSetupState({
          ...setupState,
          loading: false,
          error: error.response?.data?.message || 'Failed to set up MFA. Please try again.'
        });
      }
    };
    
    initMfaSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate, user]);
  
  const handleVerificationChange = (e) => {
    setSetupState({
      ...setupState,
      verificationCode: e.target.value.replace(/\D/g, '').substring(0, 6)
    });
  };
  
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (setupState.verificationCode.length !== 6) {
      return;
    }
    
    setSetupState({
      ...setupState,
      loading: true,
      error: null
    });
    
    try {
      const response = await verifyMfa(setupState.verificationCode);
      setSetupState({
        ...setupState,
        loading: false,
        step: 'completed',
        backupCodes: response.backupCodes
      });
    } catch (error) {
      setSetupState({
        ...setupState,
        loading: false,
        error: error.response?.data?.message || 'Invalid verification code. Please try again.'
      });
    }
  };
  
  const handleFinish = () => {
    navigate('/profile', { 
      state: { message: 'MFA has been successfully enabled for your account.' } 
    });
  };
  
  const renderStepContent = () => {
    switch (setupState.step) {
      case 'generating':
        return (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Generating your MFA credentials...</p>
          </div>
        );
        
      case 'verifying':
        return (
          <>
            <div className="mb-4">
              <h5>Step 1: Scan the QR Code</h5>
              <p>
                Scan this QR code with your authenticator app 
                (Google Authenticator, Authy, Microsoft Authenticator, etc.)
              </p>
              <div className="text-center mb-3">
                {setupState.qrCode && (
                  <img 
                    src={setupState.qrCode} 
                    alt="MFA QR Code" 
                    className="img-fluid border rounded p-2" 
                    style={{ maxWidth: '250px' }}
                  />
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <h5>Step 2: Manual Entry (if QR scan fails)</h5>
              <p>If you can't scan the QR code, enter this code manually in your app:</p>
              <div className="d-flex justify-content-center">
                <div className="input-group" style={{ maxWidth: '320px' }}>
                  <input 
                    type="text" 
                    className="form-control font-monospace" 
                    value={setupState.secret || ''} 
                    readOnly 
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(setupState.secret);
                      alert('Secret code copied to clipboard');
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h5>Step 3: Verify Setup</h5>
              <p>Enter the verification code from your authenticator app to confirm setup:</p>
              <form onSubmit={handleVerify}>
                <div className="mb-3 d-flex justify-content-center">
                  <input 
                    type="text"
                    className="form-control text-center font-monospace"
                    style={{ maxWidth: '200px', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                    value={setupState.verificationCode}
                    onChange={handleVerificationChange}
                    placeholder="000000"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                    autoFocus
                    disabled={setupState.loading}
                  />
                </div>
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={setupState.verificationCode.length !== 6 || setupState.loading}
                  >
                    {setupState.loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Verifying...
                      </>
                    ) : 'Verify & Enable MFA'}
                  </button>
                </div>
              </form>
            </div>
          </>
        );
        
      case 'completed':
        return (
          <>
            <div className="alert alert-success mb-4">
              <h4 className="alert-heading">MFA Enabled Successfully!</h4>
              <p>Your account is now protected with multi-factor authentication.</p>
            </div>
            
            <div className="mb-4">
              <h5>Backup Codes</h5>
              <p className="text-danger">
                <strong>IMPORTANT:</strong> Save these backup codes in a secure location. 
                Each code can be used once if you lose access to your authenticator app.
              </p>
              
              <div className="card mb-3">
                <div className="card-body bg-light">
                  <div className="row row-cols-2 g-2">
                    {setupState.backupCodes.map((code, index) => (
                      <div className="col" key={index}>
                        <code className="font-monospace">{code}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => {
                    const backupCodesText = setupState.backupCodes.join('\n');
                    navigator.clipboard.writeText(backupCodesText);
                    alert('Backup codes copied to clipboard');
                  }}
                >
                  Copy Backup Codes
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleFinish}
                >
                  Finish Setup
                </button>
              </div>
            </div>
          </>
        );
      
      default:
        return <p>Unknown step</p>;
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Set Up Multi-Factor Authentication</h2>
              
              {setupState.error && (
                <div className="alert alert-danger mb-4">
                  {setupState.error}
                </div>
              )}
              
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaSetup;