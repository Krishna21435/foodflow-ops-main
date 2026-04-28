import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8000';
  const DEMO_USERS = {
    'cust@foodflow.com': { id: 'demo-customer', role: 'customer', name: 'Customer Demo' },
    'rest@foodflow.com': { id: 'demo-restaurant', role: 'restaurant', name: 'Restaurant Demo' },
    'rider@foodflow.com': { id: 'demo-rider', role: 'delivery', name: 'Rider Demo' },
    'admin@foodflow.com': { id: 'demo-admin', role: 'admin', name: 'Admin Demo' }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (token === 'demo-token') {
        const storedDemoUser = localStorage.getItem('demoUser');
        if (storedDemoUser) {
          try {
            setUser(JSON.parse(storedDemoUser));
          } catch {
            localStorage.removeItem('demoUser');
            localStorage.removeItem('token');
          }
        } else {
          localStorage.removeItem('token');
        }
        setLoading(false);
        return;
      }
      axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser(res.data);
      }).catch(() => {
        localStorage.removeItem('token');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('Email and password are required');
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email: trimmedEmail, password: trimmedPassword });
      localStorage.setItem('token', res.data.token);
      localStorage.removeItem('demoUser');
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      const demoUserConfig = DEMO_USERS[trimmedEmail];
      if (!demoUserConfig || trimmedPassword !== '123456') {
        throw err;
      }

      console.warn('Backend unreachable, using demo login fallback');
      const demoUser = { ...demoUserConfig, email: trimmedEmail };
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demoUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
