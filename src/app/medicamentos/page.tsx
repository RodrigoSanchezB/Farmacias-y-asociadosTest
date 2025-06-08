"use client";

import { useState } from "react";
import SearchBar from "@/app/components/SearchBar";
import MedicamentosCard, { Medicamento } from "@/app/components/MedicamentosCard";
import { useLanguage } from "@/app/context/LanguageContext";

export default function MedicamentosPage() {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);

  // Datos de ejemplo corregidos según la interfaz Medicamento
  const datosEjemplo: Medicamento[] = [
    {
      id: 1,
      nombre: "Paracetamol",
      farmacia: "Cruz Verde",
      precio: 2700,
    },
    {
      id: 2,
      nombre: "Paracetamol",
      farmacia: "Ahumada",
      precio: 3200,
    },
    {
      id: 3,
      nombre: "Paracetamol",
      farmacia: "Salco Brand",
      precio: 3100,
    },
  ];

  // Estado para los medicamentos que se mostrarán
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>(datosEjemplo);

  const handleSearch = async (nombre: string) => {
    setLoading(true);

    try {
      // Delay de 1 segundo para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulación de filtro en frontend
      const resultados = datosEjemplo.filter((med) =>
        med.nombre.toLowerCase().includes(nombre.toLowerCase())
      );

      setMedicamentos(resultados);
    } catch (err) {
      console.error("Error inesperado:", err);
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

  const t = translations[lang];

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