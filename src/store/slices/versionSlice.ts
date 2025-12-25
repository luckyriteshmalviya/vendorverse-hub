import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { versionApi } from '@/services/api';
import { Version, CreateVersionPayload, UpdateVersionPayload } from '@/types/api.types';

interface VersionState {
  versions: Version[];
  selectedVersion: Version | null;
  loading: boolean;
  error: string | null;
}

const initialState: VersionState = {
  versions: [],
  selectedVersion: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchVersionsByVendor = createAsyncThunk(
  'versions/fetchByVendor',
  async (vendorId: string, { rejectWithValue }) => {
    try {
      return await versionApi.getVersionsByVendor(vendorId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchVersionById = createAsyncThunk(
  'versions/fetchById',
  async ({ vendorId, versionId }: { vendorId: string; versionId: string }, { rejectWithValue }) => {
    try {
      const version = await versionApi.getVersionById(vendorId, versionId);
      if (!version) {
        throw new Error('Version not found');
      }
      return version;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createVersion = createAsyncThunk(
  'versions/create',
  async (payload: CreateVersionPayload, { rejectWithValue }) => {
    try {
      return await versionApi.createVersion(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateVersion = createAsyncThunk(
  'versions/update',
  async (payload: UpdateVersionPayload, { rejectWithValue }) => {
    try {
      return await versionApi.updateVersion(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteVersion = createAsyncThunk(
  'versions/delete',
  async ({ vendorId, versionId }: { vendorId: string; versionId: string }, { rejectWithValue }) => {
    try {
      await versionApi.deleteVersion(vendorId, versionId);
      return versionId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const versionSlice = createSlice({
  name: 'versions',
  initialState,
  reducers: {
    clearSelectedVersion: (state) => {
      state.selectedVersion = null;
    },
    clearVersions: (state) => {
      state.versions = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch versions by vendor
      .addCase(fetchVersionsByVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVersionsByVendor.fulfilled, (state, action: PayloadAction<Version[]>) => {
        state.loading = false;
        state.versions = action.payload;
      })
      .addCase(fetchVersionsByVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single version
      .addCase(fetchVersionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVersionById.fulfilled, (state, action: PayloadAction<Version>) => {
        state.loading = false;
        state.selectedVersion = action.payload;
      })
      .addCase(fetchVersionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create version
      .addCase(createVersion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVersion.fulfilled, (state, action: PayloadAction<Version>) => {
        state.loading = false;
        state.versions.push(action.payload);
      })
      .addCase(createVersion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update version
      .addCase(updateVersion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVersion.fulfilled, (state, action: PayloadAction<Version>) => {
        state.loading = false;
        const index = state.versions.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.versions[index] = action.payload;
        }
        if (state.selectedVersion?.id === action.payload.id) {
          state.selectedVersion = action.payload;
        }
      })
      .addCase(updateVersion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete version
      .addCase(deleteVersion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVersion.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.versions = state.versions.filter(v => v.id !== action.payload);
        if (state.selectedVersion?.id === action.payload) {
          state.selectedVersion = null;
        }
      })
      .addCase(deleteVersion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedVersion, clearVersions, clearError } = versionSlice.actions;
export default versionSlice.reducer;
