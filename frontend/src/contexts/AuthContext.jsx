import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock authentication - replace with actual API call
    // For demo purposes, accept any credentials
    const mockUser = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      role: 'Officer',
      badge: 'OFC-' + Math.floor(Math.random() * 1000)
    };
    const mockToken = 'mock-jwt-token-' + Date.now();

    setCurrentUser(mockUser);
    setAuthToken(mockToken);
    
    // Persist to localStorage
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('authToken', mockToken);
    
    return { success: true, user: mockUser };
  };

  const signup = (formData) => {
    // Mock signup - replace with actual API call
    // For demo purposes, accept any data
    const mockUser = {
      id: 'user-' + Date.now(),
      email: formData.email,
      name: formData.fullName,
      role: 'Officer',
      badge: formData.badgeNumber || 'OFC-' + Math.floor(Math.random() * 1000),
      department: formData.department || 'Metro PD'
    };
    const mockToken = 'mock-jwt-token-' + Date.now();

    setCurrentUser(mockUser);
    setAuthToken(mockToken);
    
    // Persist to localStorage
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('authToken', mockToken);
    
    return { success: true, user: mockUser };
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  const value = {
    currentUser,
    authToken,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
