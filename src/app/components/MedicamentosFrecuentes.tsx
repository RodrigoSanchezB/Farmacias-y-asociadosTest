"use client";

import { useEffect, useState } from "react";

const medicamentosMock = [
  "Paracetamol",
  "Ibuprofeno",
  "Amoxicilina",
  "Loratadina",
  "Omeprazol"
];

export default function MedicamentosFrecuentes() {
  const [frecuentes, setFrecuentes] = useState<string[]>([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("frecuentes") || "[]");
    setFrecuentes(guardados);
  }, []);

  const toggleFrecuente = (med: string) => {
    let actualizados;
    if (frecuentes.includes(med)) {
      actualizados = frecuentes.filter((m) => m !== med);
    } else {
      actualizados = [...frecuentes, med];
    }
    setFrecuentes(actualizados);
    localStorage.setItem("frecuentes", JSON.stringify(actualizados));
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {medicamentosMock.map((med) => (
          <li key={med} className="flex justify-between items-center p-2 border rounded">
            <span>{med}</span>
            <button
              className={`px-3 py-1 rounded text-white ${
                frecuentes.includes(med) ? "bg-red-500" : "bg-green-500"
              }`}
              onClick={() => toggleFrecuente(med)}
            >
              {frecuentes.includes(med) ? "Quitar" : "Guardar"}
            </button>
          </li>
        ))}
      </ul>

      <div>
        <h2 className="text-lg font-semibold mt-6">Guardados</h2>
        <ul className="list-disc ml-5">
          {frecuentes.length === 0 && <li>No hay medicamentos guardados.</li>}
          {frecuentes.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
