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
export const useAuth = () => useContext(AuthContext);

// API Service
export const apiService = {
    login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
    register: (userData) => api.post('/auth/register', userData).then(res => res.data),
    getCityData: () => api.get('/city-data').then(res => res.data),
    getCityDataHistory: (hours = 24) => api.get(`/city-data/history?hours=${hours}`).then(res => res.data),
    getAlerts: (status = 'active', limit = 50) => api.get(`/alerts?status=${status}&limit=${limit}`).then(res => res.data),
    updateAlert: (id, updateData) => api.put(`/alerts/${id}`, updateData).then(res => res.data),
    getCitizenRequests: () => api.get('/citizen-requests').then(res => res.data),
};

// Axios Interceptors to handle auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      // No reload here, let the state handle it
    }
    return Promise.reject(error);
  }
);


// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      if (response.success) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  // FIX 1: Add the register function to handle the API call
  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        return { success: true, message: response.message };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  // FIX 2: Add the new 'register' function to the context value
  const value = { user, loading, login, logout, register, isAuthenticated: !!user };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Data Provider Component (No changes needed here)
const DataContext = createContext();
export const useData = () => useContext(DataContext);

const DataProvider = ({ children }) => {
  const [cityData, setCityData] = useState({});
  const [historicalData, setHistoricalData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [citizenRequests, setCitizenRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [city, history, activeAlerts, resolved, requests] = await Promise.all([
          apiService.getCityData(),
          apiService.getCityDataHistory(),
          apiService.getAlerts('active'),
          apiService.getAlerts('resolved', 10),
          apiService.getCitizenRequests(),
        ]);
        setCityData(city);
        setHistoricalData(history);
        setAlerts([...activeAlerts, ...resolved]);
        setCitizenRequests(requests);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch city data';
        setError(errorMessage);
        if (errorMessage === 'Invalid or expired token') {
            logout(); // If token is bad, log the user out
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, logout]); // Added logout to dependency array

  const updateAlert = async (id, updateData) => {
     try {
      const updated = await apiService.updateAlert(id, updateData);
      setAlerts(prev => prev.map(a => a._id === id ? updated : a));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to update alert' };
    }
  };
  
  const value = { cityData, historicalData, alerts, citizenRequests, loading, error, updateAlert };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Main App component now just wraps the providers
function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

// A new component to handle the main logic AFTER authentication is checked
function Main() {
  // FIX 3: Get the 'register' function from the useAuth hook
  const { user, loading: authLoading, login, logout, register } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If there's no user, show the login form
  if (!user) {
    // FIX 4: Pass the 'register' function as the 'onRegister' prop
    return <AuthComponent onLogin={login} onRegister={register} />;
  }

  // If there IS a user, wrap the dashboard in the data provider
  return (
    <DataProvider>
      <DashboardContent onLogout={logout} />
    </DataProvider>
  );
}

// A new component that can safely use both Auth and Data contexts
function DashboardContent({ onLogout }) {
  const { user } = useAuth();
  const { cityData, historicalData, alerts, citizenRequests, loading: dataLoading, error, updateAlert } = useData();
  
  return (
      <Dashboard
        user={user}
        cityData={cityData}
        historicalData={historicalData}
        alerts={alerts}
        citizenRequests={citizenRequests}
        loading={dataLoading}
        error={error}
        onUpdateAlert={updateAlert}
        onLogout={onLogout}
      />
  );
}

export default App;