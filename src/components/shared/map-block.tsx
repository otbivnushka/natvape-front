import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface MapBlockProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  markerTitle?: string;
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapClickHandlerProps {
  onClick: (lat: number, lng: number) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapBlock: React.FC<MapBlockProps> = ({
  lat,
  lng,
  zoom = 15,
  markerTitle = '',
  className = '',
  onMapClick,
}) => {
  return (
    <div className={`h-[200px] w-full overflow-hidden rounded-2xl ${className}`}>
      <MapContainer
        center={[lat ?? 55.184217, lng ?? 30.202878]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lat !== undefined && lng !== undefined && (
          <Marker position={[lat, lng]}>
            <Popup>{markerTitle}</Popup>
          </Marker>
        )}
        {onMapClick && <MapClickHandler onClick={onMapClick} />}
      </MapContainer>
    </div>
  );
};

export { MapBlock };
