import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import AuthComponent from './components/AuthComponent';
import Dashboard from './components/Dashboard';
import './App.css';

// Create API instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API Service
export const apiService = {
  // Auth endpoints
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // City data endpoints
  getCityData: async () => {
    const response = await api.get('/city-data');
    return response.data;
  },

  getCityDataHistory: async (hours = 24) => {
    const response = await api.get(`/city-data/history?hours=${hours}`);
    return response.data;
  },

  // Alerts endpoints
  getAlerts: async (status = 'active', limit = 50) => {
    const response = await api.get(`/alerts?status=${status}&limit=${limit}`);
    return response.data;
  },

  createAlert: async (alertData) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },

  updateAlert: async (id, updateData) => {
    const response = await api.put(`/alerts/${id}`, updateData);
    return response.data;
  },

  // Citizen requests endpoints
  getCitizenRequests: async () => {
    const response = await api.get('/citizen-requests');
    return response.data;
  },

  createCitizenRequest: async (requestData) => {
    const response = await api.post('/citizen-requests', requestData);
    return response.data;
  },

  // Emergency endpoints
  getEmergencies: async () => {
    const response = await api.get('/emergencies');
    return response.data;
  },

  createEmergency: async (emergencyData) => {
    const response = await api.post('/emergencies', emergencyData);
    return response.data;
  },

  // Analytics endpoints
  getAnalytics: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get(`/analytics?${params}`);
    return response.data;
  },

  // System health
  getSystemHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('currentUser');

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);

      if (response.success) {
        const { token, user: userData } = response;

        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);

        return { success: true, user: userData };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiService.register(userData);

      if (response.success) {
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create Data Context
const DataContext = React.createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Data Provider for city data management
const DataProvider = ({ children }) => {
  const [cityData, setCityData] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [citizenRequests, setCitizenRequests] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch city data
  const fetchCityData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCityData();
      setCityData(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch city data');
      console.error('Error fetching city data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      const activeAlerts = await apiService.getAlerts('active');
      const resolvedAlerts = await apiService.getAlerts('resolved', 10);
      setAlerts([...activeAlerts, ...resolvedAlerts]);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  };

  // Fetch citizen requests
  const fetchCitizenRequests = async () => {
    try {
      const data = await apiService.getCitizenRequests();
      setCitizenRequests(data);
    } catch (err) {
      console.error('Failed to fetch citizen requests:', err);
    }
  };

  // Fetch emergencies
  const fetchEmergencies = async () => {
    try {
      const data = await apiService.getEmergencies();
      setEmergencies(data);
    } catch (err) {
      console.error('Failed to fetch emergencies:', err);
    }
  };

  // Create alert
  const createAlert = async (alertData) => {
    try {
      const newAlert = await apiService.createAlert(alertData);
      setAlerts(prev => [newAlert, ...prev]);
      return { success: true, alert: newAlert };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to create alert'
      };
    }
  };

  // Update alert
  const updateAlert = async (id, updateData) => {
    try {
      const updatedAlert = await apiService.updateAlert(id, updateData);
      setAlerts(prev => prev.map(alert =>
        alert._id === id ? updatedAlert : alert
      ));
      return { success: true, alert: updatedAlert };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to update alert'
      };
    }
  };

  // Create citizen request
  const createCitizenRequest = async (requestData) => {
    try {
      const newRequest = await apiService.createCitizenRequest(requestData);
      setCitizenRequests(prev => [newRequest, ...prev]);
      return { success: true, request: newRequest };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to create request'
      };
    }
  };

  // Create emergency
  const createEmergency = async (emergencyData) => {
    try {
      const newEmergency = await apiService.createEmergency(emergencyData);
      setEmergencies(prev => [newEmergency, ...prev]);
      return { success: true, emergency: newEmergency };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to create emergency'
      };
    }
  };

  // Auto-refresh data every 30 seconds when authenticated
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchCityData();
    fetchAlerts();
    fetchCitizenRequests();
    fetchEmergencies();

    const interval = setInterval(() => {
      fetchCityData();
      fetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value = {
    cityData,
    alerts,
    citizenRequests,
    emergencies,
    loading,
    error,
    fetchCityData,
    fetchAlerts,
    fetchCitizenRequests,
    fetchEmergencies,
    createAlert,
    updateAlert,
    createCitizenRequest,
    createEmergency
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Enhanced Smart City Platform with API integration
const EnhancedSmartCityPlatform = () => {
  const { user, isAuthenticated, loading: authLoading, login, register, logout } = useAuth();
  const {
    cityData,
    alerts,
    citizenRequests,
    loading: dataLoading,
    error: dataError,
    createAlert,
    updateAlert,
    createCitizenRequest,
    createEmergency
  } = useData();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Smart City Platform...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthComponent 
        onLogin={login}
        onRegister={register}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      cityData={cityData}
      alerts={alerts}
      citizenRequests={citizenRequests}
      loading={dataLoading}
      error={dataError}
      onCreateAlert={createAlert}
      onUpdateAlert={updateAlert}
      onCreateCitizenRequest={createCitizenRequest}
      onCreateEmergency={createEmergency}
      onLogout={logout}CitizenRequest={createCitizenRequest}
      
    />
  );
};

// Main App Component
function App() {
  const [systemHealth, setSystemHealth] = useState(null);

  useEffect(() => {
    // Check system health on app start
    const checkSystemHealth = async () => {
      try {
        const health = await apiService.getSystemHealth();
        setSystemHealth(health);
      } catch (error) {
        console.error('System health check failed:', error);
        setSystemHealth({ status: 'ERROR', message: 'API not available' });
      }
    };

    checkSystemHealth();
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <DataProvider>
          <EnhancedSmartCityPlatform />

          {/* System Status Indicator */}
          {systemHealth && (
            <div className={`fixed bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium z-50 ${
              systemHealth.status === 'OK'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              API: {systemHealth.status}
            </div>
          )}
        </DataProvider>
      </AuthProvider>
    </div>
  );
}

export default App;