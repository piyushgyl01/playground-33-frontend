import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [token, setToken] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");

    if (!tokenParam) {
      setStatus({
        loading: false,
        success: false,
        error:
          "Reset token is missing. Please check your email for the correct reset link.",
      });
    } else {
      setToken(tokenParam);
    }
  }, [location.search]);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });

    // Clear error when user types
    if (status.error) {
      setStatus({
        loading: false,
        success: false,
        error: null,
      });
    }
  };

  const handlePasswordFeedback = (feedback) => {
    setPasswordFeedback(feedback);
  };

  const validateForm = () => {
    if (passwords.password !== passwords.confirmPassword) {
      setStatus({
        loading: false,
        success: false,
        error: "Passwords do not match",
      });
      return false;
    }

    if (passwordFeedback && !passwordFeedback.valid) {
      setStatus({
        loading: false,
        success: false,
        error: passwordFeedback.message,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus({
      loading: true,
      success: false,
      error: null,
    });

    try {
      await resetPassword({
        token,
        password: passwords.password,
      });

      setStatus({
        loading: false,
        success: true,
        error: null,
      });

      // Redirect to login after successful reset
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password has been reset successfully! You can now log in with your new password.",
          },
        });
      }, 3000);
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error:
          error.response?.data?.message ||
          "Password reset failed. The token may be invalid or expired.",
      });
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Set New Password</h2>

              {!token && status.error ? (
                <div className="alert alert-danger">
                  <p>{status.error}</p>
                  <Link to="/forgot-password" className="alert-link">
                    Request a new password reset
                  </Link>
                </div>
              ) : status.success ? (
                <div className="alert alert-success">
                  <h4 className="alert-heading">Password Reset Successful!</h4>
                  <p>Your password has been reset successfully.</p>
                  <p className="mb-0">
                    You will be redirected to the login page in a few seconds...
                  </p>
                </div>
              ) : (
                <>
                  {status.error && (
                    <div className="alert alert-danger">{status.error}</div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={passwords.password}
                        onChange={handleChange}
                        disabled={status.loading}
                        required
                      />
                      <PasswordStrengthMeter
                        password={passwords.password}
                        onFeedback={handlePasswordFeedback}
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        disabled={status.loading}
                        required
                      />
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status.loading || !token}
                      >
                        {status.loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Resetting Password...
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
