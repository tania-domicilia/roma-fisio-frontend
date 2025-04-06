import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-control-geocoder";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function GeocoderControl() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true,
    })
      .on("markgeocode", function (e) {
        const { center } = e.geocode;
        L.marker(center, { icon: customIcon })
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();
        map.setView(center, 15);
      })
      .addTo(map);
  }, [map]);
  return null;
}

export default function MappaPazientiPage() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/pazienti`)
      .then((res) => res.json())
      .then(async (data) => {
        const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
        const coords = await Promise.all(
          data.map(async (p) => {
            const fullAddress = encodeURIComponent(`${p.indirizzo}, ${p.cap} ${p.citta}`);
            const res = await fetch(`${NOMINATIM_URL}/${fullAddress}?format=json&limit=1`);
            const geo = await res.json();
            if (geo.length > 0) {
              return {
                id: p.id,
                nome: p.nome,
                cognome: p.cognome,
                indirizzo: p.indirizzo,
                data_inizio_piano: p.data_inizio_piano,
                data_fine_piano: p.data_fine_piano,
                lat: parseFloat(geo[0].lat),
                lon: parseFloat(geo[0].lon),
              };
            } else {
              return null;
            }
          })
        );
        setMarkers(coords.filter((m) => m));
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mappa Pazienti + Ricerca</h1>
      <MapContainer center={[41.89, 12.49]} zoom={11} style={{ height: "70vh", width: "100%" }}>
        <TileLayer
          attribution='Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeocoderControl />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lon]} icon={customIcon}>
            <Popup>
              <strong>{m.nome} {m.cognome}</strong><br />
              {m.indirizzo}<br />
              {m.data_inizio_piano} → {m.data_fine_piano}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
