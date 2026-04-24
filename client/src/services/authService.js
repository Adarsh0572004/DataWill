const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async register(name, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      // Show specific field errors if available
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors.map(e => e.message).join('. '));
      }
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe(token) {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get user');
    return data;
  }
};
