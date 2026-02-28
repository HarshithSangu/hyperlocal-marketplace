import React from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
};

function MapView({ shops, userLocation, selectedShop }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [directions, setDirections] = useState(null);
  const mapRef = useRef(null);
  const directionsServiceRef = useRef(null);

  const center = useMemo(() => {
    if (userLocation) return userLocation;
    return { lat: 17.385044, lng: 78.486671 };
  }, [userLocation]);

  const handleMapLoad = useCallback((map) => {
    if (!mapRef.current) {
      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (!selectedShop || !userLocation || !window.google) return;

    if (!directionsServiceRef.current) {
      directionsServiceRef.current =
        new window.google.maps.DirectionsService();
    }

    const directionsService = directionsServiceRef.current;

    directionsService.route(
      {
        origin: userLocation,
        destination: selectedShop,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        }
      },
    );
  }, [selectedShop, userLocation]);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={handleMapLoad}
    >
      {userLocation && <Marker position={userLocation} label="You" />}

      {shops.map((shop, i) => (
        <Marker
          key={i}
          position={{
            lat: shop.latitude,
            lng: shop.longitude,
          }}
        />
      ))}

      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}

export default React.memo(MapView);
