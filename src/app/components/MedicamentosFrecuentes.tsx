"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLanguage } from "@/app/context/LanguageContext"; // ✅ Ruta corregida


const medicamentosMock = [
  "Paracetamol",
  "Ibuprofeno",
  "Amoxicilina",
  "Loratadina",
  "Omeprazol"
];

export default function MedicamentosFrecuentes() {
  const [frecuentes, setFrecuentes] = useState<string[]>([]);
  const { lang } = useLanguage();

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("frecuentes") || "[]");
    setFrecuentes(guardados);
  }, []);

  const toggleFrecuente = (med: string) => {
    let actualizados;
    if (frecuentes.includes(med)) {
      actualizados = frecuentes.filter((m) => m !== med);
      toast.info(`${med} ${t.removeMessage}`);
    } else {
      actualizados = [...frecuentes, med];
      toast.success(`${med} ${t.saveMessage}`);
    }    
    setFrecuentes(actualizados);
    localStorage.setItem("frecuentes", JSON.stringify(actualizados));
  };

  const translations = {
    es: {
      RemoveButton: 'Quitar',
      saveButton: 'guardar',
      saveMedicationsTitle: 'Guardados',
      noSaveMedicationsText: 'No hay medicamentos guardados.',
      saveMessage: "guardado como frecuente",
      removeMessage: "eliminado de tus medicamentos frecuentes",
    },
    en: {
      RemoveButton: 'Remove',
      saveButton: 'Save',
      saveMedicationsTitle: 'Saves',
      noSaveMedicationsText: 'There is no medications saved.',
      saveMessage: "save as frequent",
      removeMessage: "remove from your frequent medications",
    },
  };

  const t = translations[lang];

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
              {frecuentes.includes(med) ? t.RemoveButton : t.saveButton}
            </button>
          </li>
        ))}
      </ul>

      <div>
        <h2 className="text-lg font-semibold mt-6">{t.saveMedicationsTitle}</h2>
        <ul className="list-disc ml-5">
          {frecuentes.length === 0 && <li>{t.noSaveMedicationsText}</li>}
          {frecuentes.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// TODO: Reemplazar localStorage con conexión a una base de datos real para persistencia de medicamentos frecuentes
// FUTURO: conectar esta funcionalidad con Supabase o Firebase