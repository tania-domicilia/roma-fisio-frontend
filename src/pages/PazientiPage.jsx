import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function PazientiPage() {
  const [pazienti, setPazienti] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    telefono: "",
    indirizzo: "",
    citta: "Roma",
    cap: "",
    data_inizio_piano: "",
    data_fine_piano: "",
    note: "",
  });

  const fetchPazienti = async () => {
    const res = await fetch(`${API_URL}/pazienti`);
    const data = await res.json();
    setPazienti(data);
  };

  useEffect(() => {
    fetchPazienti();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/pazienti`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      nome: "",
      cognome: "",
      telefono: "",
      indirizzo: "",
      citta: "Roma",
      cap: "",
      data_inizio_piano: "",
      data_fine_piano: "",
      note: "",
    });
    fetchPazienti();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Pazienti</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} className="border p-2 w-full" />
        <input name="cognome" placeholder="Cognome" value={form.cognome} onChange={handleChange} className="border p-2 w-full" />
        <input name="telefono" placeholder="Telefono" value={form.telefono} onChange={handleChange} className="border p-2 w-full" />
        <input name="indirizzo" placeholder="Indirizzo" value={form.indirizzo} onChange={handleChange} className="border p-2 w-full" />
        <input name="citta" placeholder="Città" value={form.citta} onChange={handleChange} className="border p-2 w-full" />
        <input name="cap" placeholder="CAP" value={form.cap} onChange={handleChange} className="border p-2 w-full" />
        <input type="date" name="data_inizio_piano" value={form.data_inizio_piano} onChange={handleChange} className="border p-2 w-full" />
        <input type="date" name="data_fine_piano" value={form.data_fine_piano} onChange={handleChange} className="border p-2 w-full" />
        <textarea name="note" placeholder="Note" value={form.note} onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Salva</button>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Elenco Pazienti</h2>
        <ul className="mt-2 space-y-1">
          {pazienti.map((p) => (
            <li key={p.id} className="border p-2 rounded">
              <strong>{p.nome} {p.cognome}</strong> - {p.telefono}<br />
              Indirizzo: {p.indirizzo}, {p.cap} {p.citta}<br />
              Dal {p.data_inizio_piano} al {p.data_fine_piano}<br />
              Note: {p.note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
