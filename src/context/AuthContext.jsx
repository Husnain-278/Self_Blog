import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accessToken')
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem('refreshToken')
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://127.0.0.1:8000/api/v1';

  // 🔹 Fetch user profile
  const fetchUserProfile = async (token) => {
    try {
      console.log('Fetching user profile with token:', token);
      const response = await axios.get(`${API_URL}/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User profile fetched:', response.data);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log('Failed to fetch user profile:', error);
      logout();
    }
  };

  // 🔹 Login
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/token/`, {
        username,
        password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      setAccessToken(access);
      setRefreshToken(refresh);

      await fetchUserProfile(access);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      };
    }
  };

  // 🔹 Register
  const register = async (email, username, password) => {
    try {
      const response = await axios.post(`${API_URL}/register/`, {
        email,
        username,
        password,
      });

      if (response.status === 201) {
        await login(username, password);
      }

      return { success: true };
    } catch (error) {
      const data = error.response?.data;
      let message = 'Registration failed';
      if (data) {
        const firstKey = Object.keys(data)[0];
        message = data[firstKey][0];
      }
      return { success: false, error: message };
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  // 🔹 Update profile
  const updateProfile = async (formData) => {
    try {
      console.log('Updating profile with data:', formData);
      console.log('Access token:', accessToken);

      const response = await axios.put(`${API_URL}/profile/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile update response:', response.data);
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Profile update error:', error);
      console.error('Error response:', error.response);

      const data = error.response?.data;
      let message = 'Profile update failed';
      if (data) {
        const firstKey = Object.keys(data)[0];
        message = data[firstKey][0] || data[firstKey];
      }
      return { success: false, error: message };
    }
  };

  // 🔹 Refetch profile
  const refetchProfile = async () => {
    if (accessToken) {
      await fetchUserProfile(accessToken);
    }
  };

  // 🔹 Refresh token
  const refreshAccessToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        logout();
        return null;
      }

      const response = await axios.post(`${API_URL}/token/refresh/`, {
        refresh: storedRefreshToken,
      });

      const newAccessToken = response.data.access;
      localStorage.setItem('accessToken', newAccessToken);
      setAccessToken(newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.log('Token refresh failed:', error);
      logout();
      return null;
    }
  };

  // 🔹 Init auth on load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) await fetchUserProfile(token);
      setLoading(false);
    };
    initAuth();
  }, []);

  // 🔹 Axios interceptors
  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use((config) => {
      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshToken]);

  const contextValue = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated,
    accessToken,
    refreshAccessToken,
    updateProfile,
    refetchProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
