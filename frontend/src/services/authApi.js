const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export const authApi = {
  // Login
  async login({ email, password }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed. Please verify credentials.');
      }
      return data;
    } catch (err) {
      // If backend server is unreachable (NetworkError), provide structured message
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Unable to connect to authentication server. Please ensure backend is running.');
      }
      throw err;
    }
  },

  // Customer Register
  async register({ name, email, password, phone }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed. Please check inputs.');
      }
      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Unable to connect to authentication server. Please ensure backend is running.');
      }
      throw err;
    }
  },

  // Vendor Register
  async registerVendor(vendorData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/vendor/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Vendor registration failed.');
      }
      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Unable to connect to authentication server. Please ensure backend is running.');
      }
      throw err;
    }
  }
};

export default authApi;
