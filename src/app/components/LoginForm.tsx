"use client";

import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext"; // ✅ Ruta corregida


export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { lang } = useLanguage();

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      router.push("/home");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email === "admin@farmacias.cl" && password === "1234") {
        localStorage.setItem("session", JSON.stringify({ email }));
        toast.success("Inicio de sesión exitoso 🎉");
        router.push("/home");
      } else {
        toast.error("Credenciales inválidas ❌");
      }
      setLoading(false);
    }, 1000);
  };

  const translations = {
    es: {
      title: 'Iniciar sesión',
      emailPlaceholder: 'Correo electrónico',
      passwordPlaceholbuder: 'Contraseña',
      button: 'Ingresar',
    },
    en: {
      title: 'Log in',
      emailPlaceholder: 'Emal',
      passwordPlaceholbuder: 'password',
      button: 'Enter',
    },
  };

  const t = translations[lang];

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold">{t.title}</h2>
      <input
        type="email"
        placeholder={t.emailPlaceholder}
        className="border px-4 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder={t.passwordPlaceholbuder}
        className="border px-4 py-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Cargando..." : t.button}
      </button>
    </form>
  );
}