import { useEffect, useState } from "react";
import { format, isWithinInterval, parseISO, addDays } from "date-fns";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function DashboardPage() {
  const [pazienti, setPazienti] = useState([]);
  const [fisioterapisti, setFisioterapisti] = useState([]);
  const [piani, setPiani] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/pazienti`).then(r => r.json()).then(setPazienti);
    fetch(`${API_URL}/fisioterapisti`).then(r => r.json()).then(setFisioterapisti);
    fetch(`${API_URL}/piani`).then(r => r.json()).then(setPiani);
  }, []);

  const oggi = new Date();
  const pianiAttivi = piani.filter(p =>
    parseISO(p.data_inizio) <= oggi && parseISO(p.data_fine) >= oggi
  );

  const pianiInScadenza = piani.filter(p =>
    isWithinInterval(oggi, {
      start: parseISO(p.data_fine),
      end: addDays(parseISO(p.data_fine), 7),
    })
  );

  const conteggioFisio = fisioterapisti.map(f => {
    const tot = piani.filter(p => p.fisioterapista_id === f.id).length;
    return { ...f, totale: tot };
  }).sort((a, b) => b.totale - a.totale);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">Pazienti totali</h2>
          <p className="text-3xl">{pazienti.length}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">Piani attivi oggi</h2>
          <p className="text-3xl">{pianiAttivi.length}</p>
        </div>
        <div className="bg-white shadow p-4 rounded col-span-2">
          <h2 className="font-semibold">Fisioterapisti per numero di piani</h2>
          <ul className="mt-2 space-y-1">
            {conteggioFisio.map(f => (
              <li key={f.id}>
                {f.nominativo} – {f.totale} piano{f.totale !== 1 ? "i" : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-yellow-100 border border-yellow-400 p-4 rounded">
        <h2 className="font-semibold mb-2">Piani in scadenza (entro 7 giorni)</h2>
        <ul className="list-disc ml-4 space-y-1">
          {pianiInScadenza.map(p => (
            <li key={p.id}>
              {format(parseISO(p.data_fine), "dd/MM/yyyy")} – Paziente: {p.paziente_id}
            </li>
          ))}
        </ul>
        {pianiInScadenza.length === 0 && <p>Nessun piano in scadenza.</p>}
      </div>
    </div>
  );
}
