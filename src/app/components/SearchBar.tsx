"use client";

import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import MedicamentosCard, { Medicamento } from "./MedicamentosCard";
import { toast } from "react-toastify";

export default function SearchBar() {
  const [nombre, setNombre] = useState("");
  const [resultados, setResultados] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  const translations = {
    es: {
      placeholder: 'Buscar medicamento...',
      searchButton: 'Buscar',
      loading: 'Buscando...',
      noResults: 'No se encontraron resultados.',
    },
    en: {
      placeholder: 'Search for medication...',
      searchButton: 'Search',
      loading: 'Searching...',
      noResults: 'No results found.',
    },
  };

  const t = translations[lang];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim() === "") return;

    setLoading(true);
    try {
      const res = await fetch(`/api/medicamentos?nombre=${encodeURIComponent(nombre)}`);
      if (!res.ok) throw new Error("Error en la búsqueda");
      const data = await res.json();
      setResultados(data);
    } catch (err) {
      toast.error("Hubo un problema al buscar");
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8">
      <form onSubmit={handleSearch} className="flex items-center gap-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={t.placeholder}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t.searchButton}
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-500">{t.loading}</p>}

      <div className="mt-6">
        {!loading && resultados.length === 0 && (
          <p className="text-gray-600">{t.noResults}</p>
        )}
        {resultados.map((med) => (
          <MedicamentosCard key={med.id} medicamento={med} />
        ))}
      </div>
    </div>
  );
}
