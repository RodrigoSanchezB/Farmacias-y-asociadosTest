"use client";

import { useLanguage } from "@/app/context/LanguageContext"; // ✅ Ruta corregida
 // Ajusta ruta si es necesario
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { lang, setLang } = useLanguage(); // ⬅️ Aquí usamos el contexto

  const translations = {
    es: {
      search: 'Buscar remedios',
      login: 'Login',
      language: 'Idioma',
      medications: 'Mis medicamentos',
    },
    en: {
      search: 'Search remedies',
      login: 'Login',
      language: 'Language',
      medications: 'My medications',
    },
  };

  const t = translations[lang];

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-blue-800 text-white">
      <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        Farmacias y Asociados
      </div>
      <nav className="flex gap-6 text-lg">
        <button onClick={() => router.push("/medicamentos")} className="hover:underline">
          {t.search}
        </button>
        <button onClick={() => router.push("/frecuentes")} className="hover:underline">
          {t.medications}
        </button>
        <button onClick={() => {
          localStorage.removeItem("session");
          router.push("/login");
        }} className="hover:underline">
          {t.login}
        </button>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as 'es' | 'en')}
          className="text-white rounded px-2 py-1 bg-blue-800"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </nav>
    </header>
  );
}