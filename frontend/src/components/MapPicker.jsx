import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const centerDefault = {
  lat: 17.385,
  lng: 78.4867,
};

const LOCATIONIQ_API_KEY =
  import.meta.env.VITE_LOCATIONIQ_API_KEY || "YOUR_LOCATIONIQ_API_KEY";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapEvents({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function MapPicker({ onSelect }) {
  const [marker, setMarker] = useState(null);
  const [map, setMap] = useState(null);
  const [status, setStatus] = useState("");

  const handleSelect = async (lat, lng) => {
    setMarker({ lat, lng });
    if (map) map.flyTo([lat, lng], 16);

    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`,
      );
      const data = await res.json();
      const address = data.display_name || "";
      onSelect(lat, lng, address);
    } catch (error) {
      onSelect(lat, lng, "");
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported");
      return;
    }

    setStatus("Getting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        handleSelect(lat, lng);
        setStatus("Location updated");
      },
      () => setStatus("Location access denied"),
    );
  };

  return (
    <div className="w-full h-[350px] rounded-xl overflow-hidden relative">
      <button
        type="button"
        onClick={handleCurrentLocation}
        className="absolute top-3 left-3 z-[1000] px-3 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg shadow-md border border-slate-200"
      >
        📍 Use current location
      </button>
      {status && (
        <div className="absolute top-3 right-3 z-[1000] px-3 py-2 bg-white/90 text-slate-700 text-sm rounded-lg shadow-md">
          {status}
        </div>
      )}
      <MapContainer
        center={[centerDefault.lat, centerDefault.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onSelect={handleSelect} />
        {marker && <Marker position={marker} />}
      </MapContainer>
    </div>
  );
}
