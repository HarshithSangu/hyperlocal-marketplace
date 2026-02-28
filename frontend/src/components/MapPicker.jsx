import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";

const centerDefault = {
  lat: 17.385,
  lng: 78.4867,
};

export default function MapPicker({ onSelect }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [marker, setMarker] = useState(null);

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <p className="text-slate-600">Loading map...</p>
      </div>
    );

  const handleClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarker({ lat, lng });

    // 🌍 reverse geocode to get address
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
    );
    const data = await res.json();

    const address = data.results?.[0]?.formatted_address || "";

    onSelect(lat, lng, address);
  };

  return (
    <GoogleMap
      zoom={15}
      center={marker || centerDefault}
      mapContainerStyle={{
        width: "100%",
        height: "350px",
        borderRadius: "12px",
      }}
      onClick={handleClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
}
