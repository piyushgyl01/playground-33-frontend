import API from "./authService";

export const fetchJobs = async () => {
  const response = await API.get("/jobs");
  return response.data;
};

// Get a single job by ID
export const fetchJobById = async (jobId) => {
  const response = await API.get(`/jobs/${jobId}`);
  return response.data;
};

// Create a new job
export const createJob = async (jobData) => {
  const response = await API.post("/jobs", jobData);
  return response.data;
};

// Update a job
export const updateJob = async ({ id, jobData }) => {
  const response = await API.put(`/jobs/${id}`, jobData);
  return response.data;
};

// Delete a job
export const deleteJob = async (jobId) => {
  const response = await API.delete(`/jobs/${jobId}`);
  return response.data;
};
