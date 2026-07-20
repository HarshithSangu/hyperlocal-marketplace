import React, { useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
};

function MapView({ shops, userLocation, selectedShop }) {
  const center = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    return [17.385044, 78.486671];
  }, [userLocation]);

  const route = useMemo(() => {
    if (!selectedShop || !userLocation) return [];
    return [
      [userLocation.lat, userLocation.lng],
      [selectedShop.lat, selectedShop.lng],
    ];
  }, [selectedShop, userLocation]);

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={containerStyle}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} />}

      {shops.map((shop, i) => (
        <Marker
          key={i}
          position={{
            lat: shop.latitude,
            lng: shop.longitude,
          }}
        />
      ))}

      {route.length > 0 && (
        <Polyline
          positions={route}
          pathOptions={{ color: "#4f46e5", weight: 4 }}
        />
      )}
    </MapContainer>
  );
}

export default React.memo(MapView);
