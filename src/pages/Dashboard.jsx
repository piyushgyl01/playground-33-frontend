import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Dashboard</h1>
          <div className="alert alert-success">
            <h4 className="alert-heading">Welcome, {user?.name || user?.username}!</h4>
            <p>You have successfully logged in to the protected dashboard.</p>
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Your Profile</h5>
                  <p className="card-text">View and edit your profile information</p>
                  <a href="/profile" className="btn btn-primary">Go to Profile</a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Jobs</h5>
                  <p className="card-text">View all jobs</p>
                  <Link to="/" className="btn btn-primary">Go to Jobs</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;