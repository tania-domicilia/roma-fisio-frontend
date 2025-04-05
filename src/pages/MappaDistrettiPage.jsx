import { useEffect, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";

export default function MappaDistrettiPage() {
  const [distretti, setDistretti] = useState(null);

  useEffect(() => {
    fetch("/distretti.geojson")
      .then((res) => res.json())
      .then((data) => setDistretti(data));
  }, []);

  const handleCreated = (e) => {
    const layer = e.layer;
    console.log("Nuovo poligono creato:", layer.toGeoJSON());
    // Qui potresti salvare il poligono in backend
  };

  const handleEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      console.log("Poligono modificato:", layer.toGeoJSON());
      // Salva modifiche
    });
  };

  const handleDeleted = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      console.log("Poligono eliminato:", layer.toGeoJSON());
      // Cancella dal DB
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Distretti e Zone Preferite</h1>
      <MapContainer center={[41.89, 12.49]} zoom={11} style={{ height: "70vh", width: "100%" }}>
        <TileLayer
          attribution='Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {distretti && <GeoJSON data={distretti} style={{ color: "blue", weight: 1 }} />}
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            onEdited={handleEdited}
            onDeleted={handleDeleted}
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
