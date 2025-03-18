import { useState } from 'react';
import PropTypes from 'prop-types';

const MfaForm = ({ onSubmit, loading }) => {
  const [code, setCode] = useState('');
  
  const handleChange = (e) => {
    // Only allow digits and limit to 6 characters
    const value = e.target.value.replace(/\D/g, '').substring(0, 6);
    setCode(value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 6) {
      onSubmit(code);
    }
  };
  
  return (
    <div className="card shadow-sm border-0 p-4">
      <h4 className="text-center mb-4">Authentication Code Required</h4>
      
      <p className="text-center mb-4">
        Please enter the 6-digit code from your authenticator app
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4 text-center">
          <input
            type="text"
            className="form-control form-control-lg text-center font-monospace mx-auto"
            value={code}
            onChange={handleChange}
            placeholder="000000"
            style={{ maxWidth: '200px', letterSpacing: '0.5rem' }}
            autoFocus
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="6"
            disabled={loading}
            required
          />
        </div>
          
        <div className="d-grid mb-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={code.length !== 6 || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Verifying...
              </>
            ) : 'Verify'}
          </button>
        </div>
        
        <div className="text-center">
          <p className="small text-muted mb-2">
            Don't have access to your authenticator app?
          </p>
          <button 
            type="button" 
            className="btn btn-link btn-sm p-0"
            onClick={() => alert('Enter one of your backup codes in the field above')}
          >
            Use a backup code
          </button>
        </div>
      </form>
    </div>
  );
};

MfaForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default MfaForm;