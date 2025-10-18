import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PackageManager = 'bun' | 'npm' | 'yarn' | 'pnpm';

interface UiState {
  packageManager: PackageManager;
}

const initialState: UiState = {
  packageManager: 'npm',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPackageManager: (state, action: PayloadAction<PackageManager>) => {
      state.packageManager = action.payload;
    },
  },
});

export const { setPackageManager } = uiSlice.actions;
export default uiSlice.reducer;
