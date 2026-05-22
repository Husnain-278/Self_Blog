import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
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
  const isTokenEndpoint = (url = '') => url.includes('/token/');

  // 🔹 Fetch user profile
  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
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
    navigate('/login', { replace: true });
  };

  // 🔹 Update profile
  const updateProfile = async (formData) => {
    try {
      const response = await axios.put(`${API_URL}/profile/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
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
      logout();
      return null;
    }
  };

  // 🔹 Axios interceptors (attach token, refresh with single-flight and queue)
  useEffect(() => {
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
      failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
      });
      failedQueue = [];
    };

    const requestIntercept = axios.interceptors.request.use((config) => {
      const requestUrl = config.url || '';
      if (!isTokenEndpoint(requestUrl)) {
        const token = localStorage.getItem('accessToken') || accessToken;
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url || '';

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !isTokenEndpoint(requestUrl)
        ) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axios(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          return new Promise(async (resolve, reject) => {
            try {
              const newToken = await refreshAccessToken();
              if (!newToken) {
                throw new Error('Unable to refresh token');
              }
              processQueue(null, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(axios(originalRequest));
            } catch (err) {
              processQueue(err, null);
              logout();
              reject(err);
            } finally {
              isRefreshing = false;
            }
          });
        }

        if (error.response?.status === 401 && originalRequest && isTokenEndpoint(requestUrl)) {
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshToken]);

  // 🔹 Init auth on load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) await fetchUserProfile(token);
      setLoading(false);
    };
    initAuth();
  }, []);

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
