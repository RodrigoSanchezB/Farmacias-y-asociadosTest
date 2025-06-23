"use client";

import SearchBar from "@/app/components/SearchBar";
import { useLanguage } from "@/app/context/LanguageContext";

export default function MedicamentosPage() {
  const { lang } = useLanguage();

  const translations = {
    es: {
      title: "Buscar medicamentos",
    },
    en: {
      title: "Search for medications",
    },
  };

  const t = translations[lang as "es" | "en"];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
        {t.title}
      </h1>

      <div className="max-w-2xl mx-auto">
        <SearchBar />
      </div>
    </main>
  );
}
