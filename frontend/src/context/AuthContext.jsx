import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('homematch_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('homematch_token') || null;
  });

  const [loading, setLoading] = useState(true);
  const { showSuccess, showError, showInfo } = useToast();

  // On mount, if token exists, verify session with GET /auth/me
  useEffect(() => {
    const checkAuthStatus = async () => {
      const savedToken = localStorage.getItem('homematch_token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('homematch_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          // If backend offline or token expired
          console.warn('[AuthContext] Session verification note:', error.response?.data?.message || error.message);
          if (error.response?.status === 401) {
            localStorage.removeItem('homematch_token');
            localStorage.removeItem('homematch_user');
            setUser(null);
            setToken(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  /**
   * Register API call
   */
  const registerUser = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data?.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('homematch_token', newToken);
        localStorage.setItem('homematch_user', JSON.stringify(newUser));
        showSuccess(res.data.message || 'Account created successfully!');
        return { success: true, user: newUser };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed. Check network or server.';
      showError(message);
      return { success: false, message };
    }
  };

  /**
   * Login API call
   */
  const loginUser = async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data?.success) {
        const { token: newToken, user: loggedUser } = res.data;
        setToken(newToken);
        setUser(loggedUser);
        localStorage.setItem('homematch_token', newToken);
        localStorage.setItem('homematch_user', JSON.stringify(loggedUser));
        showSuccess(res.data.message || 'Logged in successfully!');
        return { success: true, user: loggedUser };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Invalid credentials or server offline.';
      showError(message);
      return { success: false, message };
    }
  };

  /**
   * Logout user & clear tokens
   */
  const logoutUser = useCallback(() => {
    localStorage.removeItem('homematch_token');
    localStorage.removeItem('homematch_user');
    setUser(null);
    setToken(null);
    showInfo('Logged out of HomeMatch.');
  }, [showInfo]);

  /**
   * Demo Viva Quick Login
   */
  const demoLogin = (role = 'tenant') => {
    let mockProfile;
    if (role === 'admin') {
      mockProfile = {
        id: 1,
        name: 'System Administrator',
        email: 'admin@homematch.bd',
        phone: '01700000000',
        role: 'admin',
        is_verified: true
      };
    } else if (role === 'owner') {
      mockProfile = {
        id: 7,
        name: 'Engr. Mofazzal Hossain',
        email: 'mofazzal@gmail.com',
        phone: '01711223344',
        role: 'owner',
        is_verified: true
      };
    } else {
      mockProfile = {
        id: 2,
        name: 'Tanvir Ahmed',
        email: 'tanvir@homematch.bd',
        phone: '01712345678',
        role: 'tenant',
        is_verified: true
      };
    }

    const mockJwt = 'mock_demo_jwt_token_for_viva';
    setUser(mockProfile);
    setToken(mockJwt);
    localStorage.setItem('homematch_token', mockJwt);
    localStorage.setItem('homematch_user', JSON.stringify(mockProfile));
    showSuccess(`Logged in as Demo ${role.toUpperCase()}!`);
    return mockProfile;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        register: registerUser,
        login: loginUser,
        logout: logoutUser,
        demoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
