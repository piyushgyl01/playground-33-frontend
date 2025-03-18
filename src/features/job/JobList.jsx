import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllJobs, removeJob, clearSuccess } from "./jobSlice";

const JobList = () => {
  const dispatch = useDispatch();
  const {
    list: jobs,
    loading,
    error,
    success,
  } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  // Load jobs on component mount
  useEffect(() => {
    dispatch(fetchAllJobs());

    // Clear success state on unmount
    return () => {
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  // Handle job deletion
  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await dispatch(removeJob(jobId)).unwrap();
      } catch (error) {
        console.error("Failed to delete job:", error);
      }
    }
  };

  if (loading && jobs.length === 0) {
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

  return (
    <div>
      {success && (
        <div className="alert alert-success">Job deleted successfully!</div>
      )}

      <div className="d-flex justify-content-between mb-4">
        <h2>Job Listings</h2>
        <Link to="/jobs/create" className="btn btn-primary pt-2">
          Post a New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="alert alert-info">
          No jobs found. Be the first to post a job!
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {jobs.map((job) => (
            <div className="col" key={job._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {job.location || "Remote"} • {job.employmentType}
                  </h6>
                  <p className="card-text">
                    {job.description?.length > 100
                      ? `${job.description.substring(0, 100)}...`
                      : job.description || "No description provided."}
                  </p>
                  {job.salary && (
                    <p className="card-text text-success">
                      Salary: ${job.salary.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between">
                  <small className="text-muted">
                    Posted by: {job.company?.username || "Unknown"}
                  </small>
                  <div>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      View
                    </Link>
                    {/* Only show edit/delete for owner */}
                    {user &&
                      (job.company?._id === user._id ||
                        job.company === user._id) && (
                        <>
                          <Link
                            to={`/jobs/edit/${job._id}`}
                            className="btn btn-sm btn-outline-secondary me-2"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Delete
                          </button>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
