// This file is now simplified as the main platform is split into separate components
// The main functionality has been moved to:
// - AuthComponent.jsx for authentication
// - Dashboard.jsx for the main dashboard
// This file serves as the entry point that's imported by App.jsx

import React from 'react';
import { useAuth } from '../App';
import AuthComponent from './AuthComponent';
import Dashboard from './Dashboard';

const SmartCityPlatform = ({ 
  user, 
  cityData, 
  alerts, 
  citizenRequests, 
  loading, 
  error,
  onCreateAlert,
  onUpdateAlert,
  onCreateCitizenRequest,
  onCreateEmergency
}) => {
  const { login, register, logout } = useAuth();

  if (!user) {
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
      loading={loading}
      error={error}
      onCreateAlert={onCreateAlert}
      onUpdateAlert={onUpdateAlert}
      onCreateCitizenRequest={onCreateCitizenRequest}
      onCreateEmergency={onCreateEmergency}
      onLogout={logout}
    />
  );
};



export default SmartCityPlatform;