import { configureStore } from '@reduxjs/toolkit';
import vendorReducer from './slices/vendorSlice';
import versionReducer from './slices/versionSlice';

export const store = configureStore({
  reducer: {
    vendors: vendorReducer,
    versions: versionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
