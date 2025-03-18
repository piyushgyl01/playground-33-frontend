// src/features/job/jobSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as jobService from '../../services/jobService';

// Async thunks for CRUD operations
export const fetchAllJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobService.fetchJobs();
      return response.jobs;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch jobs'
      );
    }
  }
);

export const fetchJob = createAsyncThunk(
  'jobs/fetchOne',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await jobService.fetchJobById(jobId);
      return response.job;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch job'
      );
    }
  }
);

export const addJob = createAsyncThunk(
  'jobs/add',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await jobService.createJob(jobData);
      return response.job;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add job'
      );
    }
  }
);

export const editJob = createAsyncThunk(
  'jobs/edit',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const response = await jobService.updateJob({ id, jobData });
      return response.job;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update job'
      );
    }
  }
);

export const removeJob = createAsyncThunk(
  'jobs/remove',
  async (jobId, { rejectWithValue }) => {
    try {
      await jobService.deleteJob(jobId);
      return jobId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete job'
      );
    }
  }
);

// Jobs slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    list: [],           // All jobs
    currentJob: null,   // Currently selected job
    loading: false,     // Loading state
    error: null,        // Error state
    success: false      // Success state (for operations like create/update)
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all jobs
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single job
      .addCase(fetchJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentJob = null;
      })
      .addCase(fetchJob.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.loading = false;
      })
      .addCase(fetchJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add new job
      .addCase(addJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.list.unshift(action.payload); // Add to beginning of list
        state.loading = false;
        state.success = true;
      })
      .addCase(addJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Edit job
      .addCase(editJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editJob.fulfilled, (state, action) => {
        // Update in list
        const index = state.list.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        
        // Update current job
        state.currentJob = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(editJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete job
      .addCase(removeJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeJob.fulfilled, (state, action) => {
        state.list = state.list.filter(job => job._id !== action.payload);
        state.loading = false;
        state.success = true;
        
        // Clear current job if it was deleted
        if (state.currentJob && state.currentJob._id === action.payload) {
          state.currentJob = null;
        }
      })
      .addCase(removeJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;