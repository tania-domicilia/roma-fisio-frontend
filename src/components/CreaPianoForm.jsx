import { useEffect, useState } from "react";

export default function CreaPianoForm({ fisioterapistaId, onCreated }) {
  const [pazienti, setPazienti] = useState([]);
  const [form, setForm] = useState({
    paziente_id: "",
    fisioterapista_id: fisioterapistaId,
    data_inizio: "",
    data_fine: "",
    note: "",
  });

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/pazienti")
      .then((res) => res.json())
      .then((data) => setPazienti(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(import.meta.env.VITE_API_URL + "/piani", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert("Piano creato con successo");
      onCreated();
    } else {
      alert("Errore nella creazione del piano");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 border p-3 mt-2 rounded bg-gray-50">
      <select name="paziente_id" value={form.paziente_id} onChange={handleChange} className="w-full border p-2">
        <option value="">Seleziona paziente</option>
        {pazienti.map((p) => (
          <option key={p.id} value={p.id}>{p.nome} {p.cognome}</option>
        ))}
      </select>
      <input type="date" name="data_inizio" value={form.data_inizio} onChange={handleChange} className="w-full border p-2" />
      <input type="date" name="data_fine" value={form.data_fine} onChange={handleChange} className="w-full border p-2" />
      <textarea name="note" placeholder="Note (opzionali)" value={form.note} onChange={handleChange} className="w-full border p-2" />
      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Conferma Piano</button>
    </form>
  );
}
