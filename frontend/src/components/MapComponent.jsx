import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, MessageSquare, Trash2, MapPin } from 'lucide-react';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icon creation function
const createIcon = (color) => {
  return new L.divIcon({
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    className: 'bg-transparent',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const icons = {
  alert: createIcon('#EF4444'), 
  request: createIcon('#3B82F6'), 
  waste_ok: createIcon('#22C55E'), 
  waste_warning: createIcon('#F59E0B'), 
  waste_full: createIcon('#DC2626'), 
};

const MapComponent = ({ alerts, citizenRequests, cityData }) => {
  const cityCenter = [
    cityData?.location?.lat || 19.0760,
    cityData?.location?.lng || 72.8777
  ];

  const wasteBins = cityData?.waste || [];

  const getWasteIcon = (level) => {
    if (level > 85) return icons.waste_full;
    if (level > 60) return icons.waste_warning;
    return icons.waste_ok;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-[85vh]">
      <MapContainer center={cityCenter} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Alerts Markers */}
        {alerts.filter(a => a.location?.lat && a.location?.lng).map(alert => (
          <Marker
            key={`alert-${alert._id}`}
            position={[alert.location.lat, alert.location.lng]}
            icon={icons.alert}
          >
            <Popup>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <strong className="text-red-600">{alert.category} Alert</strong>
              </div>
              <p>{alert.message}</p>
              <small>{alert.location.description}</small>
            </Popup>
          </Marker>
        ))}

        {/* Citizen Request Markers (assuming location is a "lat,lng" string) */}
        {citizenRequests.filter(r => r.location.includes(',')).map(request => {
           const [lat, lng] = request.location.split(',').map(Number);
           if (!lat || !lng) return null;
           return (
            <Marker
              key={`request-${request._id}`}
              position={[lat, lng]}
              icon={icons.request}
            >
              <Popup>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <strong className="text-blue-600">{request.type}</strong>
                </div>
                <p>{request.description}</p>
                <p className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 inline-block">
                  {request.status}
                </p>
              </Popup>
            </Marker>
           );
        })}

        {/* Waste Bin Markers */}
        {wasteBins.filter(b => b.coordinates?.lat && b.coordinates?.lng).map(bin => (
           <Marker
            key={`waste-${bin.area}`}
            position={[bin.coordinates.lat, bin.coordinates.lng]}
            icon={getWasteIcon(bin.level)}
          >
            <Popup>
               <div className="flex items-center space-x-2">
                  <Trash2 className="w-4 h-4 text-gray-700" />
                  <strong className="text-gray-800">Waste Bin: {bin.area}</strong>
                </div>
                <p>Fill Level: {bin.level.toFixed(1)}%</p>
                <p>Status: {bin.status}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;