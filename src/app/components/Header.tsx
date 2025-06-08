"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const translations = {
    es: {
      search: "Buscar remedios",
      login: "Login",
      language: "Idioma",
      medications: "Mis medicamentos",
    },
    en: {
      search: "Search remedies",
      login: "Login",
      language: "Language",
      medications: "My medications",
    },
  };

  const t = translations[lang];

  return (
    <header className="bg-blue-800 text-white w-full">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo alineado a la izquierda */}
        <div
          className="text-xl sm:text-2xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          Farmacias y Asociados
        </div>

        {/* Botón de menú visible solo en móviles */}
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>

        {/* Menú horizontal para pantallas medianas/grandes */}
        <nav className="hidden sm:flex gap-4 sm:gap-6 text-sm sm:text-lg items-center ml-auto">
          <button onClick={() => router.push("/medicamentos")} className="hover:underline">
            {t.search}
          </button>
          <button onClick={() => router.push("/frecuentes")} className="hover:underline">
            {t.medications}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("session");
              router.push("/login");
            }}
            className="hover:underline"
          >
            {t.login}
          </button>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "es" | "en")}
            className="text-white bg-blue-800 border border-white rounded px-2 py-1"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </nav>
      </div>

      {/* Menú vertical desplegable para móviles */}
      {menuOpen && (
        <nav className="sm:hidden flex flex-col items-start gap-4 px-4 pb-4 text-base bg-blue-700">
          <button onClick={() => router.push("/medicamentos")} className="hover:underline">
            {t.search}
          </button>
          <button onClick={() => router.push("/frecuentes")} className="hover:underline">
            {t.medications}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("session");
              router.push("/login");
            }}
            className="hover:underline"
          >
            {t.login}
          </button>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "es" | "en")}
            className="text-white bg-blue-700 border border-white rounded px-2 py-1"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </nav>
      )}
    </header>
  );
}