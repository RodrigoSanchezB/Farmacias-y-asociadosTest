"use client";

export interface Medicamento {
  id: number;
  nombre: string;
  precio: number;
  farmacia: string;
}

export default function MedicamentosCard({ medicamento }: { medicamento: Medicamento }) {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg transition-all">
      <h2 className="text-xl font-bold text-blue-700">{medicamento.nombre}</h2>
      <p className="text-gray-600 mt-2">Precio: ${medicamento.precio.toLocaleString()}</p>
      <p className="text-gray-600">Farmacia: {medicamento.farmacia}</p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Guardar en frecuentes
      </button>
    </div>
  );
}