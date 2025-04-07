import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function FisioterapistiPage() {
  const [fisioterapisti, setFisioterapisti] = useState([]);
  const [form, setForm] = useState({
    nominativo: "",
    telefono: "",
    distretti: "",
    zone_coperte: "",
    zone_preferite: "",
    note: "",
  });

  const fetchFisioterapisti = async () => {
    const res = await fetch(`${API_URL}/fisioterapisti`);
    const data = await res.json();
    setFisioterapisti(data);
  };

  useEffect(() => {
    fetchFisioterapisti();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/fisioterapisti`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      nominativo: "",
      telefono: "",
      distretti: "",
      zone_coperte: "",
      zone_preferite: "",
      note: "",
    });
    fetchFisioterapisti();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Fisioterapisti</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="nominativo" placeholder="Nominativo" value={form.nominativo} onChange={handleChange} className="border p-2 w-full" />
        <input name="telefono" placeholder="Telefono" value={form.telefono} onChange={handleChange} className="border p-2 w-full" />
        <input name="distretti" placeholder="Distretti" value={form.distretti} onChange={handleChange} className="border p-2 w-full" />
        <input name="zone_coperte" placeholder="Zone Coperte" value={form.zone_coperte} onChange={handleChange} className="border p-2 w-full" />
        <input name="zone_preferite" placeholder="Zone Preferite" value={form.zone_preferite} onChange={handleChange} className="border p-2 w-full" />
        <textarea name="note" placeholder="Note" value={form.note} onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Salva</button>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Elenco Fisioterapisti</h2>
        <ul className="mt-2 space-y-1">
          {fisioterapisti.map((f) => (
            <li key={f.id} className="border p-2 rounded">
              <strong>{f.nominativo}</strong> - {f.telefono}<br />
              Zone: {f.zone_coperte}<br />
              Preferite: {f.zone_preferite || "Nessuna"}<br />
              Note: {f.note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
