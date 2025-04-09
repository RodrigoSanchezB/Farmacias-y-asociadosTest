"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      router.push("/home");
    }
  }, [router]); // 👈 Ahora sí

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@farmacias.cl" && password === "1234") {
      localStorage.setItem("session", JSON.stringify({ email }));
      router.push("/home");
    } else {
      alert("Credenciales inválidas");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold">Iniciar sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        className="border px-4 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="border px-4 py-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ingresar
      </button>
    </form>
  );
}
