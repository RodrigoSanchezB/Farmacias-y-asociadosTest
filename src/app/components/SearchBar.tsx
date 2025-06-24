"use client";

import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import MedicamentoGrid from "./MedicamentoGrid";
import { toast } from "react-toastify";
import { Coordinates, useGeolocation } from "../hooks/useGeolocation";
import { haversineDistance } from "../utils/distance";
import { Medicamento } from "./MedicamentosCard";

export default function SearchBar() {
  const [nombre, setNombre] = useState<string>("");
  const [resultados, setResultados] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { lang } = useLanguage();
  const { coords } = useGeolocation();

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

  const UMBRAL_KM = 5;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim() === "") return;

    setLoading(true);
    try {
      const res = await fetch(`/api/medicamentos?nombre=${encodeURIComponent(nombre)}`);
      if (res.status === 404) {
        toast.info(t.noResults);
        setResultados([]);
        return;
      }
      if (!res.ok) throw new Error("Error en la búsqueda");

      let data: Medicamento[] = await res.json();

      // Si tenemos coords, calculamos distancia y marcamos nearby
      if (coords) {
  data = data.map((med) => ({
    ...med,
    farmacias: med.farmacias.map((f) => {
      const d = haversineDistance(
        coords.latitude,
        coords.longitude,
        f.latitud!,
        f.longitud!
      );
      return {
        ...f,
        distance: d,
        nearby: d <= UMBRAL_KM,
      };
    }),
  }));
}

// **AÑADE ESTO PARA DEBUG**
console.log("📍 Resultados con distancias:",
  JSON.stringify(data, null, 2)
);

setResultados(data);


      setResultados(data);
    } catch (err) {
      toast.error("Hubo un problema al buscar");
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
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

      {!loading && <MedicamentoGrid medicamentos={resultados} />}
    </div>
  );
}
