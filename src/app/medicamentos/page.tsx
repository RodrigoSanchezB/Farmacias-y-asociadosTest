"use client";

import { useState } from "react";
import SearchBar from "@/app/components/SearchBar";
import MedicamentosCard, { Medicamento } from "@/app/components/MedicamentosCard";
import { useLanguage } from "@/app/context/LanguageContext";
export default function MedicamentosPage() {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

  const handleSearch = async (nombre: string) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/medicamentos?nombre=${encodeURIComponent(nombre)}`);
      if (!response.ok) {
        throw new Error("Error en la consulta a la API");
      }

      const data = await response.json();

      // Asegurar que los datos coincidan con la interfaz Medicamento
      const resultados: Medicamento[] = data.map((item: any, index: number) => ({
        id: item.id || index,
        nombre: item.nombre || "Desconocido",
        farmacia: item.farmacia || "No especificada",
        precio: item.precio || 0,
      }));

      setMedicamentos(resultados);
    } catch (err) {
      console.error("Error al buscar medicamentos:", err);
      setMedicamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    es: {
      title: "Buscar medicamentos",
      searchButton: "Buscar",
    },
    en: {
      title: "Search for medications",
      searchButton: "Search",
    },
  };

  const t = translations[lang as 'es' | 'en'];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
        {t.title}
      </h1>

      <div className="max-w-2xl mx-auto">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {loading ? (
          <p className="text-center text-blue-800 text-lg mt-10">
            Cargando medicamentos...
          </p>
        ) : medicamentos.length > 0 ? (
          medicamentos.map((med) => (
            <MedicamentosCard key={med.id} medicamento={med} />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No se han encontrado medicamentos.
          </p>
        )}
      </div>
    </main>
  );
}
