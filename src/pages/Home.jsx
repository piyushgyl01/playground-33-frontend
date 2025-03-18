import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4 mb-4">Welcome to Auth Demo</h1>
          <p className="lead mb-4">
            A secure authentication system with Redux Toolkit
          </p>
          
          {isAuthenticated ? (
            <div>
              <p className="mb-4">
                You are logged in as <strong>{user?.name || user?.username}</strong>
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
                <Link to="/profile" className="btn btn-outline-primary">
                  View Profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
