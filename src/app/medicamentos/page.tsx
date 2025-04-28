"use client";

import { useState } from "react";
import SearchBar from "@/app/components/SearchBar";
import MedicamentosCard, { Medicamento } from "@/app/components/MedicamentosCard";

export default function MedicamentosPage() {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

  const handleSearch = async (nombre: string) => {
    // Aquí en el futuro hay que tener un fetch real a la API o base de datos
    console.log("Buscar medicamento:", nombre);

    // Dejamos de momento la func vacia
    // Ejemplo para más adelante:
    // const response = await fetch(`/api/medicamentos?nombre=${nombre}`);
    // const data = await response.json();
    // setMedicamentos(data);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
        Buscar medicamentos
      </h1>

      <div className="max-w-2xl mx-auto">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {medicamentos.length > 0 ? (
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
