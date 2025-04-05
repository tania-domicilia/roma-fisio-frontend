import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FisioterapistiPage from "../pages/FisioterapistiPage";
import PazientiPage from "../pages/PazientiPage";
import MappaPazientiPage from "../pages/MappaPazientiPage";
import MappaDistrettiPage from "../pages/MappaDistrettiPage";
import ZonePreferitePage from "../pages/ZonePreferitePage";
import SuggerisciFisioterapistiPage from "../pages/SuggerisciFisioterapistiPage";
import DashboardPage from "../pages/DashboardPage";
import { useEffect, useState } from "react";

export default function AppRoutes() {
  const [scadenze, setScadenze] = useState(false);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/piani")
      .then((res) => res.json())
      .then((data) => {
        const oggi = new Date();
        const scadenza = data.some(p => {
          const fine = new Date(p.data_fine);
          return fine >= oggi && fine <= new Date(oggi.getTime() + 7 * 86400000);
        });
        setScadenze(scadenza);
      });
  }, []);

  return (
    <Router>
      <nav className="p-4 bg-gray-100 space-x-4 text-sm font-medium">
        <Link to="/dashboard">Dashboard{scadenze && " ⚠️"}</Link>
        <Link to="/">Fisioterapisti</Link>
        <Link to="/pazienti">Pazienti</Link>
        <Link to="/zone">Zone Preferite</Link>
        <Link to="/mappa">Mappa Pazienti</Link>
        <Link to="/distretti">Mappa Distretti</Link>
        <Link to="/suggerisci">Suggerimenti</Link>
      </nav>
      <Routes>
        <Route path="/" element={<FisioterapistiPage />} />
        <Route path="/pazienti" element={<PazientiPage />} />
        <Route path="/mappa" element={<MappaPazientiPage />} />
        <Route path="/distretti" element={<MappaDistrettiPage />} />
        <Route path="/zone" element={<ZonePreferitePage />} />
        <Route path="/suggerisci" element={<SuggerisciFisioterapistiPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}
