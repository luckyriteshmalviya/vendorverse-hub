import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { vendorApi } from '@/services/api';
import { Vendor, CreateVendorPayload, UpdateVendorPayload } from '@/types/api.types';

interface VendorState {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  loading: boolean;
  error: string | null;
}

const initialState: VendorState = {
  vendors: [],
  selectedVendor: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchVendors = createAsyncThunk(
  'vendors/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await vendorApi.getVendors();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchVendorById = createAsyncThunk(
  'vendors/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const vendor = await vendorApi.getVendorById(id);
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      return vendor;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createVendor = createAsyncThunk(
  'vendors/create',
  async (payload: CreateVendorPayload, { rejectWithValue }) => {
    try {
      return await vendorApi.createVendor(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateVendor = createAsyncThunk(
  'vendors/update',
  async (payload: UpdateVendorPayload, { rejectWithValue }) => {
    try {
      return await vendorApi.updateVendor(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteVendor = createAsyncThunk(
  'vendors/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await vendorApi.deleteVendor(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    clearSelectedVendor: (state) => {
      state.selectedVendor = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action: PayloadAction<Vendor[]>) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single vendor
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action: PayloadAction<Vendor>) => {
        state.loading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create vendor
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendor.fulfilled, (state, action: PayloadAction<Vendor>) => {
        state.loading = false;
        state.vendors.push(action.payload);
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update vendor
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action: PayloadAction<Vendor>) => {
        state.loading = false;
        const index = state.vendors.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
        if (state.selectedVendor?.id === action.payload.id) {
          state.selectedVendor = action.payload;
        }
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete vendor
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVendor.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.vendors = state.vendors.filter(v => v.id !== action.payload);
        if (state.selectedVendor?.id === action.payload) {
          state.selectedVendor = null;
        }
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedVendor, clearError } = vendorSlice.actions;
export default vendorSlice.reducer;
