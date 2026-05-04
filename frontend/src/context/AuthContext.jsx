import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// ── helpers for the offline / no-backend fallback ──────────────────────────
const getLocalUsers = () => {
  try { return JSON.parse(localStorage.getItem('localUsers') || '{}'); }
  catch { return {}; }
};
const saveLocalUsers = (users) => localStorage.setItem('localUsers', JSON.stringify(users));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8000';

  // Hardcoded demo accounts (password: 123456)
  const DEMO_USERS = {
    'cust@foodflow.com':  { id: 1, role: 'customer',   name: 'Customer User' },
    'rest@foodflow.com':  { id: 2, role: 'restaurant', name: 'Rest Staff'    },
    'rider@foodflow.com': { id: 3, role: 'delivery',   name: 'Rider Nick'    },
    'admin@foodflow.com': { id: 4, role: 'admin',      name: 'Ops Admin'     },
  };

  // ── restore session on mount ────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (token === 'demo-token') {
        const stored = localStorage.getItem('demoUser');
        if (stored) {
          try { setUser(JSON.parse(stored)); }
          catch {
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
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        setUser(res.data);
      }).catch(() => {
        localStorage.removeItem('token');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ── login ───────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const trimmedEmail    = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('Email and password are required');
    }

    // 1. Try real backend
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: trimmedEmail,
        password: trimmedPassword,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.removeItem('demoUser');
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      const isNetworkError = !err.response; // ECONNREFUSED / offline

      if (isNetworkError) {
        // 2. Check locally-registered users
        const localUsers  = getLocalUsers();
        const localUser   = localUsers[trimmedEmail];
        if (localUser && localUser.password === trimmedPassword) {
          console.warn('Backend unreachable – using locally registered user');
          const { password: _pw, ...safeUser } = localUser;
          localStorage.setItem('token', 'demo-token');
          localStorage.setItem('demoUser', JSON.stringify(safeUser));
          setUser(safeUser);
          return safeUser;
        }

        // 3. Hardcoded demo accounts (pass: 123456)
        const demoConfig = DEMO_USERS[trimmedEmail];
        if (demoConfig && trimmedPassword === '123456') {
          console.warn('Backend unreachable – using demo login fallback');
          const demoUser = { ...demoConfig, email: trimmedEmail };
          localStorage.setItem('token', 'demo-token');
          localStorage.setItem('demoUser', JSON.stringify(demoUser));
          setUser(demoUser);
          return demoUser;
        }
      }

      throw err;
    }
  };

  // ── signup ──────────────────────────────────────────────────────────────
  const signup = async (name, email, password, role = 'customer') => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName  = name.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      throw new Error('All fields are required');
    }

    // 1. Try real backend
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name: trimmedName, email: trimmedEmail, password, role,
      });
      const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
        email: trimmedEmail, password,
      });
      localStorage.setItem('token', loginRes.data.token);
      localStorage.removeItem('demoUser');
      setUser(loginRes.data.user);
      return loginRes.data.user;

    } catch (err) {
      const isNetworkError = !err.response;
      if (!isNetworkError) throw err; // real server error (e.g. duplicate email)

      // 2. Offline fallback – persist to localStorage
      console.warn('Backend unreachable – saving user locally');
      const localUsers = getLocalUsers();

      if (localUsers[trimmedEmail] || DEMO_USERS[trimmedEmail]) {
        throw new Error('An account with this email already exists.');
      }

      const newUser = {
        id: Date.now(),
        name: trimmedName,
        email: trimmedEmail,
        password, // plaintext only in the local fallback store
        role,
      };
      localUsers[trimmedEmail] = newUser;
      saveLocalUsers(localUsers);

      const { password: _pw, ...safeUser } = newUser;
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('demoUser', JSON.stringify(safeUser));
      setUser(safeUser);
      return safeUser;
    }
  };

  // ── logout ──────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demoUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
