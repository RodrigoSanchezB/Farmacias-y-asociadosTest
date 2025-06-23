"use client";

import MedicamentosCard, { Medicamento } from "./MedicamentosCard";

export default function MedicamentoGrid({ medicamentos }: { medicamentos: Medicamento[] }) {
  if (medicamentos.length === 0) {
    return <p className="text-gray-600 text-center mt-6">No se han encontrado medicamentos.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {medicamentos.map((med) => (
        <MedicamentosCard key={med.id} medicamento={med} />
      ))}
    </div>
  );
}
