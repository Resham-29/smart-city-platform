import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// Custom icon for waste bins
const wasteIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3299/3299935.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Custom icon for alerts
const alertIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const CityMap = ({ cityData, alerts }) => {
  // Use the city location from data, or default to Mumbai if not available
  const cityPosition = cityData?.location?.lat && cityData?.location?.lng
    ? [cityData.location.lat, cityData.location.lng]
    : [19.0760, 72.8777];

  // Filter for waste bins that are nearly full or overflowing
  const highLevelWasteBins = cityData?.waste?.filter(bin => bin.level > 75) || [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">City Overview Map</h3>
      <div style={{ height: '300px', width: '100%' }}>
        <MapContainer center={cityPosition} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Markers for High-Level Waste Bins */}
          {highLevelWasteBins.map((bin) => (
            <Marker
              key={bin.area}
              position={[bin.coordinates.lat, bin.coordinates.lng]}
              icon={wasteIcon}
            >
              <Popup>
                <strong>Waste Bin: {bin.area}</strong><br />
                Fill Level: {bin.level.toFixed(1)}%
              </Popup>
              <Tooltip direction="top" offset={[0, -35]} opacity={1} permanent>
                {bin.level.toFixed(0)}%
              </Tooltip>
            </Marker>
          ))}
          
          {/* Markers for Active Alerts with Locations */}
          {alerts?.filter(alert => alert.location && alert.location.lat).map((alert) => (
             <Marker
                key={alert._id}
                position={[alert.location.lat, alert.location.lng]}
                icon={alertIcon}
              >
              <Popup>
                <strong>{alert.category} Alert</strong><br/>
                {alert.message}
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>
    </div>
  );
};

export default CityMap;
