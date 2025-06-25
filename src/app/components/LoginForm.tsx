"use client";

import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { lang } = useLanguage();

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      router.push("/home");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
});


      const data = await response.json();

      if (response.ok) {
        if (data?.token) {
          localStorage.setItem("session", JSON.stringify({
            token: data.token,
            name: data.name || "",
          }));
          toast.success("Inicio de sesión exitoso 🎉");
          router.push("/home");
        }
      } else {
        setError(data?.msg || "Error desconocido");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error en el servidor ❌");
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    es: {
      title: 'Iniciar sesión',
      emailPlaceholder: 'Correo electrónico',
      passwordPlaceholder: 'Contraseña',
      button: 'Ingresar',
    },
    en: {
      title: 'Log in',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
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
        placeholder={t.passwordPlaceholder}
        className="border px-4 py-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Cargando..." : t.button}
      </button>
    </form>
  );
}
