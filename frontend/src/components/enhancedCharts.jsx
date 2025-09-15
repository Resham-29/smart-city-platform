import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Color palette for charts
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F97316',
  info: '#06B6D4',
  success: '#22C55E',
  purple: '#8B5CF6'
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.danger, COLORS.warning, COLORS.info];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">
          {formatter ? formatter(label) : label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Format time for X-axis
const formatTime = (tickItem) => {
  return new Date(tickItem).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format date for X-axis
const formatDate = (tickItem) => {
  return new Date(tickItem).toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// Traffic Congestion Line Chart
export const TrafficChart = ({ data, height = 300 }) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({
      timestamp: item.timestamp,
      congestion: item.traffic?.congestion || 0,
      avgSpeed: item.traffic?.avgSpeed || 0,
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Traffic Overview (24h)</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatTime}
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip content={<CustomTooltip formatter={formatTime} />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="congestion" 
            name="Congestion (%)" 
            stroke={COLORS.danger} 
            strokeWidth={3}
            dot={{ fill: COLORS.danger, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="avgSpeed" 
            name="Avg Speed (km/h)" 
            stroke={COLORS.primary} 
            strokeWidth={3}
            dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Energy Consumption Area Chart
export const EnergyChart = ({ data, height = 300 }) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({
      timestamp: item.timestamp,
      totalConsumption: item.energy?.totalConsumption || 0,
      renewableGeneration: item.energy?.renewableGeneration || 0,
      solarOutput: item.energy?.solarOutput || 0,
      windOutput: item.energy?.windOutput || 0,
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Energy Consumption & Generation (24h)</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatTime}
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip content={<CustomTooltip formatter={formatTime} />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="totalConsumption"
            stackId="1"
            name="Total Consumption (MWh)"
            stroke={COLORS.danger}
            fill={COLORS.danger}
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="renewableGeneration"
            stackId="2"
            name="Renewable Generation (MWh)"
            stroke={COLORS.secondary}
            fill={COLORS.secondary}
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Air Quality Trend Chart
export const AirQualityChart = ({ data, height = 300 }) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({
      timestamp: item.timestamp,
      aqi: item.airQuality?.aqi || 0,
      pm25: item.airQuality?.pm25 || 0,
      pm10: item.airQuality?.pm10 || 0,
      ozone: item.airQuality?.ozone || 0,
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Air Quality Trends (24h)</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatTime}
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip content={<CustomTooltip formatter={formatTime} />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="aqi" 
            name="AQI" 
            stroke={COLORS.secondary} 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="pm25" 
            name="PM2.5 (µg/m³)" 
            stroke={COLORS.accent} 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="pm10" 
            name="PM10 (µg/m³)" 
            stroke={COLORS.info} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Water Management Bar Chart
export const WaterChart = ({ data, height = 300 }) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({
      timestamp: item.timestamp,
      quality: item.water?.quality || 0,
      consumption: item.water?.consumption || 0,
      pressure: item.water?.pressure || 0,
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Water Management (24h)</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatTime}
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip content={<CustomTooltip formatter={formatTime} />} />
          <Legend />
          <Bar 
            dataKey="quality" 
            name="Water Quality (/100)" 
            fill={COLORS.info}
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="pressure" 
            name="Water Pressure (PSI)" 
            fill={COLORS.primary}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Energy Sources Pie Chart
export const EnergySourcesChart = ({ data, height = 300 }) => {
  const chartData = useMemo(() => {
    if (!data || !data.energy) return [];
    
    const { solarOutput = 0, windOutput = 0, totalConsumption = 0, renewableGeneration = 0 } = data.energy;
    const nonRenewable = Math.max(0, totalConsumption - renewableGeneration);
    
    return [
      { name: 'Solar Energy', value: solarOutput, color: COLORS.accent },
      { name: 'Wind Energy', value: windOutput, color: COLORS.info },
      { name: 'Other Renewable', value: Math.max(0, renewableGeneration - solarOutput - windOutput), color: COLORS.secondary },
      { name: 'Non-Renewable', value: nonRenewable, color: COLORS.danger }
    ].filter(item => item.value > 0);
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Current Energy Sources</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Infrastructure Status Chart
export const InfrastructureChart = ({ data, height = 300 }) => {
  const chartData = useMemo(() => {
    if (!data || !data.infrastructure) return [];
    
    const { streetLights, parking, wifi, cctv } = data.infrastructure;
    
    return [
      {
        category: 'Street Lights',
        active: streetLights?.active || 0,
        total: streetLights?.total || 0,
        percentage: streetLights?.total ? ((streetLights.active / streetLights.total) * 100) : 0
      },
      {
        category: 'Parking',
        active: parking?.occupied || 0,
        total: parking?.total || 0,
        percentage: parking?.total ? ((parking.occupied / parking.total) * 100) : 0
      },
      {
        category: 'WiFi Users',
        active: wifi?.activeUsers || 0,
        total: 10000, // Assuming max capacity
        percentage: wifi?.activeUsers ? ((wifi.activeUsers / 10000) * 100) : 0
      },
      {
        category: 'CCTV',
        active: cctv?.active || 0,
        total: cctv?.total || 0,
        percentage: cctv?.total ? ((cctv.active / cctv.total) * 100) : 0
      }
    ];
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Infrastructure Status</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} layout="horizontal" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis type="number" domain={[0, 100]} stroke="#6B7280" fontSize={12} />
          <YAxis type="category" dataKey="category" stroke="#6B7280" fontSize={12} width={70} />
          <Tooltip 
            formatter={(value, name) => [`${value.toFixed(1)}%`, 'Usage']}
            labelFormatter={(label) => `${label} Status`}
          />
          <Bar 
            dataKey="percentage" 
            fill={COLORS.primary}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Combined Overview Chart
export const OverviewChart = ({ data, height = 400 }) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.slice(-24).map(item => ({
      time: formatTime(item.timestamp),
      traffic: item.traffic?.congestion || 0,
      aqi: item.airQuality?.aqi || 0,
      energy: item.energy?.gridEfficiency || 0,
      water: item.water?.quality || 0,
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">System Overview (Last 24 Hours)</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="traffic" 
            name="Traffic Congestion %" 
            stroke={COLORS.danger} 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="aqi" 
            name="Air Quality Index" 
            stroke={COLORS.secondary} 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="energy" 
            name="Energy Efficiency %" 
            stroke={COLORS.accent} 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="water" 
            name="Water Quality (/100)" 
            stroke={COLORS.info} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};z