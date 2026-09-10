import { createSlice } from '@reduxjs/toolkit';

const initialUser = (() => {
  try {
    const stored = localStorage.getItem('atelier_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
})();

const initialToken = localStorage.getItem('atelier_token') || null;

const initialState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  loading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      try {
        localStorage.setItem('atelier_token', action.payload.token);
        localStorage.setItem('atelier_user', JSON.stringify(action.payload.user));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      try {
        localStorage.removeItem('atelier_token');
        localStorage.removeItem('atelier_user');
      } catch (err) {
        console.warn('LocalStorage clear failed:', err);
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { authStart, authSuccess, authFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
