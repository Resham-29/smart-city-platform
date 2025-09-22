import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Car, 
  Zap, 
  Droplets, 
  Wind, 
  MapPin, 
  Users, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  LineChart,
  PieChart,
  Map 
} from 'lucide-react';

// Import all chart components
import {
  TrafficChart,
  EnergyChart,
  AirQualityChart,
  WaterChart,
  EnergySourcesChart,
  InfrastructureChart,
  OverviewChart
} from './enhancedCharts';
import MapComponent from './MapComponent';

// --- MetricCard, AlertCard, DashboardHeader, Sidebar components are unchanged ---
const MetricCard = ({ title, value, unit, icon: Icon, trend, color, subtitle }) => {
  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    teal: 'from-teal-500 to-teal-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
          
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          {trend !== 0 && (
            <span className={`text-xs font-medium ${
              trend > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const AlertCard = ({ alert, onUpdate }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${getPriorityColor(alert.priority)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getPriorityIcon(alert.priority)}
          <div>
            <h4 className="font-medium text-gray-900">{alert.message}</h4>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <span>{alert.category}</span>
              {alert.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{alert.location.description || 'N/A'}</span>
                  </span>
                </>
              )}
              <span>•</span>
              <span>{new Date(alert.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        
        {alert.status === 'active' && onUpdate && (
          <button
            onClick={() => onUpdate(alert._id, { status: 'acknowledged' })}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
};

const DashboardHeader = ({ user, onLogout, sidebarOpen, setSidebarOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart City Dashboard</h1>
            <p className="text-sm text-gray-600">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const Sidebar = ({ isOpen, activeTab, setActiveTab }) => {
  const navigation = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'map', name: 'Live Map', icon: Map },
    { id: 'traffic', name: 'Traffic', icon: Car },
    { id: 'energy', name: 'Energy', icon: Zap },
    { id: 'environment', name: 'Environment', icon: Wind },
    { id: 'water', name: 'Water', icon: Droplets },
    { id: 'alerts', name: 'Alerts', icon: Bell },
    { id: 'citizens', name: 'Citizens', icon: Users },
  ];

  return (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40" />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-200 ease-in-out lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Smart City</h2>
                <p className="text-xs text-gray-500">Management Platform</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};
// --- OverviewTab and AnalyticsTab are unchanged ---
const OverviewTab = ({ cityData, historicalData }) => {
  if (!cityData.timestamp) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Traffic Congestion"
          value={cityData.traffic?.congestion?.toFixed(1) || '0'}
          unit="%"
          icon={Car}
          trend={-2.1}
          color="blue"
          subtitle={`Avg Speed: ${cityData.traffic?.avgSpeed?.toFixed(0) || 0} km/h`}
        />
        
        <MetricCard
          title="Air Quality Index"
          value={cityData.airQuality?.aqi?.toFixed(0) || '0'}
          icon={Wind}
          trend={1.5}
          color="green"
          subtitle={`Status: ${cityData.airQuality?.status || 'Good'}`}
        />
        
        <MetricCard
          title="Energy Consumption"
          value={cityData.energy?.totalConsumption?.toFixed(0) || '0'}
          unit="MWh"
          icon={Zap}
          trend={-0.8}
          color="yellow"
          subtitle={`${cityData.energy?.gridEfficiency?.toFixed(1) || 0}% efficient`}
        />
        
        <MetricCard
          title="Water Quality"
          value={cityData.water?.quality?.toFixed(1) || '0'}
          unit="/100"
          icon={Droplets}
          trend={0.3}
          color="teal"
          subtitle={`${cityData.water?.leaks || 0} leaks detected`}
        />
      </div>

      {/* Main Overview Chart */}
      {historicalData && historicalData.length > 0 && (
        <OverviewChart data={historicalData} height={400} />
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnergySourcesChart data={cityData} height={300} />
        <InfrastructureChart data={cityData} height={300} />
      </div>
    </div>
  );
};

const AnalyticsTab = ({ historicalData }) => {
  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">City Analytics</h2>
        <div className="text-sm text-gray-500">
          Last 24 hours • {historicalData.length} data points
        </div>
      </div>

      {/* Traffic and Air Quality Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TrafficChart data={historicalData} height={350} />
        <AirQualityChart data={historicalData} height={350} />
      </div>

      {/* Energy and Water Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EnergyChart data={historicalData} height={350} />
        <WaterChart data={historicalData} height={350} />
      </div>
    </div>
  );
};


// --- FIX IS HERE in AlertsTab ---
const AlertsTab = ({ alerts, onUpdateAlert }) => {
  // FIX 1: Add a guard clause to prevent crashes if 'alerts' is not an array.
  // This will show a clean message instead of a blank page.
  if (!Array.isArray(alerts) || alerts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts</h3>
        <p className="text-gray-500">There are no active or recently resolved alerts to display.</p>
      </div>
    );
  }

  // FIX 2: Make the filter more robust by checking if 'alert' exists before accessing its properties.
  const activeAlerts = alerts.filter(alert => alert && alert.status === 'active');
  const resolvedAlerts = alerts.filter(alert => alert && alert.status === 'resolved');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">System Alerts</h2>
        <div className="flex items-center space-x-4 text-sm">
          <span className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{activeAlerts.length} Active</span>
          </span>
          <span className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{resolvedAlerts.length} Resolved</span>
          </span>
        </div>
      </div>

      {activeAlerts.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Active Alerts</h3>
          {activeAlerts.map((alert) => (
            <AlertCard
              key={alert._id}
              alert={alert}
              onUpdate={onUpdateAlert}
            />
          ))}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-green-900 mb-2">All Clear!</h3>
          <p className="text-green-700">No active alerts at this time.</p>
        </div>
      )}

      {resolvedAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Recently Resolved</h3>
          {resolvedAlerts.slice(0, 5).map((alert) => (
            <AlertCard key={alert._id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ 
  user, 
  cityData, 
  historicalData, 
  alerts, 
  citizenRequests, 
  loading, 
  error,
  onUpdateAlert,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab cityData={cityData} historicalData={historicalData} />;
      case 'analytics':
        return <AnalyticsTab historicalData={historicalData} />;
      case 'map':
        return <MapComponent
                  alerts={alerts}
                  citizenRequests={citizenRequests}
                  cityData={cityData}
                />;
      case 'alerts':
        return <AlertsTab alerts={alerts} onUpdateAlert={onUpdateAlert} />;
      case 'traffic':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Current Congestion"
                value={cityData.traffic?.congestion?.toFixed(1) || '0'}
                unit="%"
                icon={Car}
                trend={-2.1}
                color="blue"
              />
              <MetricCard
                title="Average Speed"
                value={cityData.traffic?.avgSpeed?.toFixed(0) || '0'}
                unit="km/h"
                icon={Activity}
                trend={1.8}
                color="green"
              />
              <MetricCard
                title="Accidents Today"
                value={cityData.traffic?.accidents || '0'}
                icon={AlertTriangle}
                trend={-15}
                color="red"
              />
              <MetricCard
                title="Active Signals"
                value={cityData.traffic?.activeSignals || '0'}
                icon={Activity}
                trend={0.2}
                color="purple"
              />
            </div>
            <TrafficChart data={historicalData} height={400} />
          </div>
        );
      case 'energy':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Total Consumption"
                value={cityData.energy?.totalConsumption?.toFixed(0) || '0'}
                unit="MWh"
                icon={Zap}
                trend={-0.8}
                color="yellow"
              />
              <MetricCard
                title="Renewable Generation"
                value={cityData.energy?.renewableGeneration?.toFixed(0) || '0'}
                unit="MWh"
                icon={Zap}
                trend={2.3}
                color="green"
              />
              <MetricCard
                title="Grid Efficiency"
                value={cityData.energy?.gridEfficiency?.toFixed(1) || '0'}
                unit="%"
                icon={Activity}
                trend={0.5}
                color="blue"
              />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <EnergyChart data={historicalData} height={350} />
              <EnergySourcesChart data={cityData} height={350} />
            </div>
          </div>
        );
      case 'environment':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Air Quality Index"
                value={cityData.airQuality?.aqi?.toFixed(0) || '0'}
                icon={Wind}
                trend={1.5}
                color="green"
                subtitle={cityData.airQuality?.status || 'Good'}
              />
              <MetricCard
                title="PM2.5"
                value={cityData.airQuality?.pm25?.toFixed(1) || '0'}
                unit="µg/m³"
                icon={Wind}
                trend={-0.3}
                color="teal"
              />
              <MetricCard
                title="PM10"
                value={cityData.airQuality?.pm10?.toFixed(1) || '0'}
                unit="µg/m³"
                icon={Wind}
                trend={-0.8}
                color="blue"
              />
              <MetricCard
                title="Ozone"
                value={cityData.airQuality?.ozone?.toFixed(1) || '0'}
                unit="µg/m³"
                icon={Wind}
                trend={0.2}
                color="purple"
              />
            </div>
            
            <AirQualityChart data={historicalData} height={400} />
          </div>
        );
      case 'water':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Water Quality"
                value={cityData.water?.quality?.toFixed(1) || '0'}
                unit="/100"
                icon={Droplets}
                trend={0.3}
                color="teal"
              />
              <MetricCard
                title="Water Pressure"
                value={cityData.water?.pressure?.toFixed(0) || '0'}
                unit="PSI"
                icon={Droplets}
                trend={-0.1}
                color="blue"
              />
              <MetricCard
                title="Daily Consumption"
                value={cityData.water?.consumption?.toFixed(2) || '0'}
                unit="ML"
                icon={Droplets}
                trend={1.2}
                color="green"
              />
              <MetricCard
                title="Active Leaks"
                value={cityData.water?.leaks || '0'}
                icon={AlertTriangle}
                trend={-25}
                color="red"
                subtitle="Detected issues"
              />
            </div>
            
            <WaterChart data={historicalData} height={400} />
          </div>
        );
      case 'citizens':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Citizen Requests</h2>
              <div className="text-sm text-gray-500">
                {citizenRequests.length} total requests
              </div>
            </div>
            
            {citizenRequests.length > 0 ? (
              <div className="grid gap-4">
                {citizenRequests.slice(0, 10).map((request) => (
                  <div key={request._id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{request.type}</h4>
                        <p className="text-gray-600 mt-1">{request.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{request.location}</span>
                          </span>
                          <span>•</span>
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests</h3>
                <p className="text-gray-500">No citizen requests at this time.</p>
              </div>
            )}
          </div>
        );
      default:
        return <OverviewTab cityData={cityData} historicalData={historicalData} />;
    }
  };

  if (loading && !cityData.timestamp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Smart City Platform...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <DashboardHeader 
          user={user} 
          onLogout={onLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="flex-1 p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;