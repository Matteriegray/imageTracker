import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../api/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      // Check for specific error statuses
      if (response.status === 503) {
        return { 
          success: false, 
          message: 'Database is not connected. Please ask your database administrator to whitelist the IP address in MongoDB Atlas.' 
        };
      }
      
      if (!response.ok) {
        return { success: false, message: data.message || 'Invalid credentials' };
      }

      setCurrentUser(data.user);
      setAuthToken(data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Unable to connect to the server. Please check if the backend is running on port 5000.' 
      };
    }
  };

  const signup = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      // Check for specific error statuses
      if (response.status === 503) {
        return { 
          success: false, 
          message: 'Database is not connected. Please ask your database administrator to whitelist the IP address in MongoDB Atlas.' 
        };
      }
      
      if (!response.ok) {
        return { success: false, message: data.message || 'Signup failed' };
      }

      setCurrentUser(data.user);
      setAuthToken(data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: 'Unable to connect to the server. Please check if the backend is running on port 5000.' 
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.status === 503) {
        return {
          success: false,
          message: 'Database is not connected. Please contact administrator.'
        };
      }

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to update profile' };
      }

      // Update local state with new user data and token
      setCurrentUser(data.user);
      setAuthToken(data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Unable to connect to the server. Please try again.'
      };
    }
  };

  const value = {
    currentUser,
    authToken,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
