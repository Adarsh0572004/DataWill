import { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '../lib/auth-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        // Store a compat token for API calls that still use auth middleware
        if (data.session?.token) {
          localStorage.setItem('datawill_token', data.session.token);
        }
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) throw new Error(error.message || 'Login failed');
    setUser(data.user);
    if (data.session?.token) {
      localStorage.setItem('datawill_token', data.session.token);
    }
    return data;
  };

  const register = async (name, email, password) => {
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });
    if (error) throw new Error(error.message || 'Registration failed');
    setUser(data.user);
    if (data.session?.token) {
      localStorage.setItem('datawill_token', data.session.token);
    }
    return data;
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (e) { /* ignore */ }
    localStorage.removeItem('datawill_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token: localStorage.getItem('datawill_token'), loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
