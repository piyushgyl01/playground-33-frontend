import { useState } from "react";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="card shadow-sm border-0 p-4">
      <div className="d-flex flex-column align-items-center text-center mb-4">
        <h3 className="mb-0">{user?.name || "User"}</h3>
        <p className="text-muted">@{user?.username}</p>
        {user?.email && <p className="small">{user.email}</p>}
      </div>

      <div className="card-body">
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
              <span className="text-muted">{user.email}</span>
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
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
