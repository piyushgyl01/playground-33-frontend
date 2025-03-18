import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PasswordStrengthMeter = ({ password, userInfo = {}, onFeedback }) => {
  const [strength, setStrength] = useState({
    score: 0,
    feedback: {
      warning: '',
      suggestions: []
    }
  });
  
  useEffect(() => {
    // Skip evaluation for empty passwords
    if (!password) {
      setStrength({
        score: 0,
        feedback: {
          warning: '',
          suggestions: []
        }
      });
      
      if (onFeedback) {
        onFeedback({
          valid: false,
          message: 'Password is required',
          score: 0
        });
      }
      
      return;
    }
    
    // Basic checks
    const basicChecks = [];
    
    // Check minimum length (8 characters)
    if (password.length < 8) {
      basicChecks.push('Password must be at least 8 characters long');
    }
    
    // Check for uppercase
    if (!/[A-Z]/.test(password)) {
      basicChecks.push('Add uppercase letters');
    }
    
    // Check for lowercase
    if (!/[a-z]/.test(password)) {
      basicChecks.push('Add lowercase letters');
    }
    
    // Check for numbers
    if (!/\d/.test(password)) {
      basicChecks.push('Add numbers');
    }
    
    // Check for special characters
    if (!/[^A-Za-z0-9]/.test(password)) {
      basicChecks.push('Add special characters (e.g., !@#$%)');
    }
    
    // Check for common passwords (simple version)
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome'];
    if (commonPasswords.includes(password.toLowerCase())) {
      basicChecks.push('Avoid common passwords');
    }
    
    // Check if password contains user info
    const userInfoToCheck = [
      userInfo.username, 
      userInfo.email, 
      userInfo.name
    ].filter(Boolean);
    
    const containsPersonalInfo = userInfoToCheck.some(info => 
      info && password.toLowerCase().includes(info.toLowerCase())
    );
    
    if (containsPersonalInfo) {
      basicChecks.push('Avoid using personal information in your password');
    }
    
    // Calculate score based on basic checks
    let calculatedScore;
    if (basicChecks.length === 0) {
      calculatedScore = 4; // Very strong
    } else if (basicChecks.length <= 1) {
      calculatedScore = 3; // Strong
    } else if (basicChecks.length <= 2) {
      calculatedScore = 2; // Medium
    } else if (basicChecks.length <= 3) {
      calculatedScore = 1; // Weak
    } else {
      calculatedScore = 0; // Very weak
    }
    
    setStrength({
      score: calculatedScore,
      feedback: {
        warning: basicChecks[0] || '',
        suggestions: basicChecks
      }
    });
    
    // Send feedback through callback
    if (onFeedback) {
      onFeedback({
        valid: calculatedScore >= 2, // Medium or stronger is valid
        message: basicChecks[0] || '',
        suggestions: basicChecks,
        score: calculatedScore
      });
    }
    
  }, [password, userInfo, onFeedback]);
  
  // Don't render anything for empty passwords
  if (!password) {
    return null;
  }
  
  // Colors for different strength levels
  const getColor = () => {
    switch (strength.score) {
      case 0: return '#dc3545'; // Very Weak - Red
      case 1: return '#ffc107'; // Weak - Yellow
      case 2: return '#fd7e14'; // Medium - Orange
      case 3: return '#20c997'; // Strong - Teal
      case 4: return '#198754'; // Very Strong - Green
      default: return '#e9ecef'; // Gray
    }
  };
  
  // Label for strength levels
  const getLabel = () => {
    switch (strength.score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  };
  
  return (
    <div className="mt-2">
      <div className="d-flex align-items-center mb-1">
        <div className="progress flex-grow-1" style={{ height: '8px' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${(strength.score + 1) * 20}%`,
              backgroundColor: getColor()
            }}
            aria-valuenow={(strength.score + 1) * 20}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <span className="ms-2 small" style={{ color: getColor() }}>
          {getLabel()}
        </span>
      </div>
      
      {strength.feedback.suggestions.length > 0 && (
        <div className="small text-muted mt-1">
          <ul className="ps-3 mb-0">
            {strength.feedback.suggestions.slice(0, 3).map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string.isRequired,
  userInfo: PropTypes.object,
  onFeedback: PropTypes.func
};

export default PasswordStrengthMeter;