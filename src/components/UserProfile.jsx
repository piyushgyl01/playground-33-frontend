import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import EmailVerificationBanner from "./EmailVerificationBanner";
import MfaManagement from "./MfaManagement";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Handle success messages passed via navigation
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);

      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <>
      {/* Show email verification banner if email is not verified */}
      <EmailVerificationBanner />

      {/* Success message for MFA operations, etc. */}
      {successMessage && (
        <div className="alert alert-success mb-4">{successMessage}</div>
      )}

      <div className="card shadow-sm border-0 p-4 mb-4">
        <div className="d-flex flex-column align-items-center text-center mb-4">
          <h3 className="mb-0">{user?.name || "User"}</h3>
          <p className="text-muted">@{user?.username}</p>
          {user?.email && (
            <p className="small">
              {user.email}
              {user.emailVerified ? (
                <span className="badge bg-success ms-2">Verified</span>
              ) : (
                <span className="badge bg-warning text-dark ms-2">
                  Unverified
                </span>
              )}
            </p>
          )}
        </div>

        <div className="card-body p-0">
          <h5 className="card-title">Account Information</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span>Username</span>
              <span className="text-muted">{user?.username}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span>Name</span>
              <span className="text-muted">{user?.name}</span>
            </li>
            {user?.email && (
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>Email</span>
                <div>
                  <span className="text-muted me-2">{user.email}</span>
                  {user.emailVerified ? (
                    <span className="badge bg-success">Verified</span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Unverified
                    </span>
                  )}
                </div>
              </li>
            )}
            {user?.googleId && (
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>Google Account</span>
                <span className="badge bg-primary">Connected</span>
              </li>
            )}
            {user?.githubId && (
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>GitHub Account</span>
                <span className="badge bg-primary">Connected</span>
              </li>
            )}
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span>Two-Factor Authentication</span>
              {user?.mfaEnabled ? (
                <span className="badge bg-success">Enabled</span>
              ) : (
                <span className="badge bg-secondary">Disabled</span>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* MFA Management Section */}
      <MfaManagement user={user} />

      {/* Security Actions */}
      <div className="card shadow-sm border-0 p-4">
        <h5 className="card-title">Security Actions</h5>
        <div className="list-group">
          <a
            href="#"
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={(e) => {
              e.preventDefault();
              alert("Change password functionality would go here");
            }}
          >
            <div>
              <div className="fw-bold">Change Password</div>
              <div className="small text-muted">
                Update your account password
              </div>
            </div>
            <i className="bi bi-chevron-right"></i>
          </a>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
