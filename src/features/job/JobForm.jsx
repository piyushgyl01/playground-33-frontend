import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addJob,
  editJob,
  fetchJob,
  clearError,
  clearSuccess,
} from "./jobSlice";

const JobForm = () => {
  const { jobId } = useParams();
  const isEditMode = !!jobId;

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    salary: "",
    employmentType: "full-time",
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob, loading, error, success } = useSelector(
    (state) => state.jobs
  );

  // If editing, fetch the job and populate form
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchJob(jobId));
    }

    // Clean up on unmount
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch, jobId, isEditMode]);

  // Populate form when job is loaded
  useEffect(() => {
    if (isEditMode && currentJob) {
      setFormData({
        title: currentJob.title || "",
        location: currentJob.location || "",
        description: currentJob.description || "",
        salary: currentJob.salary || "",
        employmentType: currentJob.employmentType || "full-time",
        isActive:
          currentJob.isActive !== undefined ? currentJob.isActive : true,
      });
    }
  }, [currentJob, isEditMode]);

  // Redirect on successful save
  useEffect(() => {
    if (success) {
      navigate("/jobs");
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Job title is required";
    }

    if (formData.salary && isNaN(Number(formData.salary))) {
      errors.salary = "Salary must be a number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Parse numeric fields
    const jobData = {
      ...formData,
      salary: formData.salary ? Number(formData.salary) : undefined,
    };

    try {
      if (isEditMode) {
        await dispatch(editJob({ id: jobId, jobData })).unwrap();
      } else {
        await dispatch(addJob(jobData)).unwrap();
      }
    } catch (err) {
      console.error("Failed to save job:", err);
    }
  };

  if (isEditMode && loading && !currentJob) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow border-0">
      <div className="card-body p-4">
        <h2 className="card-title mb-4">
          {isEditMode ? "Edit Job Listing" : "Create New Job Listing"}
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Job Title*
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.title ? "is-invalid" : ""}`}
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            {formErrors.title && (
              <div className="invalid-feedback">{formErrors.title}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York, NY or Remote"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Job Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="salary" className="form-label">
                Salary
              </label>
              <input
                type="text"
                className={`form-control ${
                  formErrors.salary ? "is-invalid" : ""
                }`}
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Annual salary in USD"
              />
              {formErrors.salary && (
                <div className="invalid-feedback">{formErrors.salary}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="employmentType" className="form-label">
                Employment Type
              </label>
              <select
                className="form-select"
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isActive">
              Active Listing
            </label>
            <div className="form-text">
              Inactive listings won't appear in public search results.
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/jobs")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {isEditMode ? "Saving..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Create Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
