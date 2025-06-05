"use client";

import MedicamentosFrecuentes from "@/app/components/MedicamentosFrecuentes";
import { useLanguage } from "@/app/context/LanguageContext"; // ✅ Ruta corregida


export default function FrecuentesPage() {
  const { lang } = useLanguage();

  const translations = {
    es: {
      title: 'Medicamentos Frecuentes',
    },
    en: {
      title: 'Frequent Medications',
    },
  };

  const t = translations[lang];

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
      <MedicamentosFrecuentes />
    </main>
  );
}