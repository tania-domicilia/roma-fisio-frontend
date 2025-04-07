import { useEffect, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function ZonePreferitePage() {
  const [fisioterapisti, setFisioterapisti] = useState([]);
  const [selectedFisioId, setSelectedFisioId] = useState("");
  const [existingZones, setExistingZones] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/fisioterapisti`)
      .then((res) => res.json())
      .then((data) => setFisioterapisti(data));
  }, []);

  useEffect(() => {
    if (selectedFisioId) {
      const fisio = fisioterapisti.find((f) => f.id === selectedFisioId);
      if (fisio && fisio.geo_zones) {
        try {
          setExistingZones(JSON.parse(fisio.geo_zones));
        } catch (e) {
          console.error("Errore parsing GeoJSON:", e);
        }
      } else {
        setExistingZones(null);
      }
    }
  }, [selectedFisioId, fisioterapisti]);

  const handleCreated = async (e) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();
    const payload = {
      geo_zones: JSON.stringify({
        type: "FeatureCollection",
        features: [geojson],
      }),
    };

    if (!selectedFisioId) {
      alert("Seleziona prima un fisioterapista!");
      return;
    }

    await fetch(`${API_URL}/fisioterapisti/${selectedFisioId}/zone`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    alert("Zona salvata!");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Zone Preferite</h1>

      <div className="mb-4">
        <label className="block mb-1">Seleziona Fisioterapista:</label>
        <select
          className="border p-2 w-full"
          value={selectedFisioId}
          onChange={(e) => setSelectedFisioId(e.target.value)}
        >
          <option value="">-- Scegli --</option>
          {fisioterapisti.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nominativo}
            </option>
          ))}
        </select>
      </div>

      <MapContainer center={[41.89, 12.49]} zoom={11} style={{ height: "70vh", width: "100%" }}>
        <TileLayer
          attribution='Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {existingZones && <GeoJSON data={existingZones} style={{ color: "green", weight: 2 }} />}
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            draw={{
              rectangle: false,
              circle: false,
              marker: false,
              circlemarker: false,
              polyline: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}
