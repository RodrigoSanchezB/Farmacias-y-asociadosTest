"use client";

import { useLanguage } from "@/app/context/LanguageContext";

export interface Medicamento {
  id: string;
  nombre: string;
  farmacias: {
    nombre: string;
    direccion: string;
    precio: number;
    fecha: string;
  }[];
}

export default function MedicamentosCard({ medicamento }: { medicamento: Medicamento }) {
  const { lang } = useLanguage();

  const translations = {
    es: {
      price: 'Precio',
      drugstore: 'Farmacia',
      save: 'Guardar en frecuentes',
    },
    en: {
      price: 'Price',
      drugstore: 'Drugstore',
      save: 'Save to favorites',
    },
  };

  const t = translations[lang];

  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg transition-all mb-4">
      <h2 className="text-xl font-bold text-blue-700 mb-2">{medicamento.nombre}</h2>

      {medicamento.farmacias.map((f, i) => (
        <div key={i} className="bg-gray-50 p-3 rounded mb-2">
          <p className="text-gray-800 font-semibold">{t.drugstore}: {f.nombre}</p>
          <p className="text-gray-600">{f.direccion}</p>
          <p className="text-gray-600">{t.price}: ${f.precio.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Actualizado: {f.fecha}</p>
        </div>
      ))}

      <button className="mt-4 bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700">
        {t.save}
      </button>
    </div>
  );
}
