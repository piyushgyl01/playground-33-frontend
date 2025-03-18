import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchJob, removeJob, clearCurrentJob } from "./jobSlice";

const JobDetail = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentJob, loading, error } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  // Fetch job data on component mount
  useEffect(() => {
    dispatch(fetchJob(jobId));

    // Clean up on unmount
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [dispatch, jobId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await dispatch(removeJob(jobId)).unwrap();
        navigate("/jobs");
      } catch (error) {
        console.error("Failed to delete job:", error);
      }
    }
  };

  // Check if user is the owner of the job
  const isOwner =
    user &&
    currentJob &&
    (currentJob.company?._id === user._id || currentJob.company === user._id);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  if (!currentJob) {
    return <div className="alert alert-warning">Job not found.</div>;
  }

  return (
    <div className="card shadow border-0">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between mb-4">
          <Link to="/" className="btn btn-outline-secondary">
            &larr; Back to Jobs
          </Link>

          {isOwner && (
            <div>
              <Link
                to={`/jobs/edit/${jobId}`}
                className="btn btn-outline-primary me-2"
              >
                Edit
              </Link>
              <button className="btn btn-outline-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>

        <h1 className="card-title mb-3">{currentJob.title}</h1>

        <div className="row mb-4">
          <div className="col-md-6">
            <p className="mb-1">
              <strong>Location:</strong> {currentJob.location || "Remote"}
            </p>
            <p className="mb-1">
              <strong>Employment Type:</strong> {currentJob.employmentType}
            </p>
            {currentJob.salary && (
              <p className="mb-1 text-success">
                <strong>Salary:</strong> ${currentJob.salary.toLocaleString()}
              </p>
            )}
            <p className="mb-1">
              <strong>Status:</strong>{" "}
              {currentJob.isActive ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="col-md-6 text-md-end">
            <p className="mb-1">
              <strong>Posted by:</strong>{" "}
              {currentJob.company?.name || "Unknown"}
            </p>
            {currentJob.createdAt && (
              <p className="text-muted mb-1">
                <strong>Date Posted:</strong>{" "}
                {new Date(currentJob.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <h5 className="card-subtitle mb-2">Job Description</h5>
        <div className="card-text mb-4">
          {currentJob.description ? (
            <p style={{ whiteSpace: "pre-line" }}>{currentJob.description}</p>
          ) : (
            <p className="text-muted">No description provided.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
