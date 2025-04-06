import { useState, useEffect } from "react";
import CreaPianoForm from "../components/CreaPianoForm";
import * as turf from "@turf/turf";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function SuggerisciFisioterapistiPage() {
  const [indirizzo, setIndirizzo] = useState("");
  const [risultati, setRisultati] = useState([]);
  const [loading, setLoading] = useState(false);
  const [point, setPoint] = useState(null);

  const cercaFisioterapisti = async () => {
    setLoading(true);
    setRisultati([]);
    setPoint(null);

    const encodedAddress = encodeURIComponent(indirizzo);
    fetch(`https://nominatim.openstreetmap.org/search/${encodedAddress}?format=json&limit=1`);
    const geo = await resGeo.json();
    if (!geo.length) {
      alert("Indirizzo non trovato");
      setLoading(false);
      return;
    }
    const punto = turf.point([parseFloat(geo[0].lon), parseFloat(geo[0].lat)]);
    setPoint([parseFloat(geo[0].lat), parseFloat(geo[0].lon)]);

    const resFisio = await fetch(`${API_URL}/fisioterapisti`);
    const fisioterapisti = await resFisio.json();

    const compatibili = fisioterapisti.filter(f => {
      if (!f.geo_zones) return false;
      try {
        const zone = JSON.parse(f.geo_zones);
        return zone.features.some(feat => turf.booleanPointInPolygon(punto, feat));
      } catch (e) {
        return false;
      }
    }).map(f => ({
      ...f,
      zone: JSON.parse(f.geo_zones)
    }));

    setRisultati(compatibili);
    setLoading(false);
  };

  const [formFisio, setFormFisio] = useState(null);

const creaPiano = (f) => {
  setFormFisio(f);

    alert(\`Piano creato per il fisioterapista \${f.nominativo} (funzione da completare!)\`);
    // TODO: qui collegheremo al paziente, con date
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Suggerisci Fisioterapisti per Indirizzo</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Inserisci indirizzo completo"
          value={indirizzo}
          onChange={(e) => setIndirizzo(e.target.value)}
        />
        <button onClick={cercaFisioterapisti} className="bg-blue-600 text-white px-4 py-2 rounded">
          Cerca
        </button>
      </div>

      {point && (
        <MapContainer center={point} zoom={13} style={{ height: "60vh", marginBottom: "1rem" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={point} icon={markerIcon}>
            <Popup>Indirizzo inserito</Popup>
          </Marker>
          {risultati.map(f => (
            <GeoJSON key={f.id} data={f.zone} style={{ color: "green" }}>
              <Popup>
                <strong>{f.nominativo}</strong><br />
                Tel: {f.telefono}<br />
                <button className="bg-blue-500 text-white px-2 py-1 mt-1 rounded text-sm" onClick={() => creaPiano(f)}>
                  Crea piano
                </button>
              </Popup>
            </GeoJSON>
          ))}
        </MapContainer>
      )}

      {!loading && risultati.length > 0 && (
        <ul className="space-y-2">
          {risultati.map((f) => (
            <li key={f.id} className="border p-3 rounded">
              <strong>{f.nominativo}</strong><br />
              Tel: {f.telefono}<br />
              Zone preferite: {f.zone_preferite || "non specificate"}<br />
              <button onClick={() => creaPiano(f)} className="text-blue-600 text-sm underline mt-1">Crea piano</button>
            </li>
          ))}
        </ul>
      )}
    {formFisio && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Nuovo Piano per {formFisio.nominativo}</h2>
          <CreaPianoForm fisioterapistaId={formFisio.id} onCreated={() => setFormFisio(null)} />
        </div>
      )}
    </div>
  );
}
