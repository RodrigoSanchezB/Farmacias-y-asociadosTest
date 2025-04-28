"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("session");
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-blue-800 text-white">
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Farmacias y Asociados
      </div>
      <nav className="flex gap-6 text-lg">
        <button onClick={() => router.push("/medicamentos")} className="hover:underline">
          Buscar Medicamentos
        </button>
        <button onClick={() => router.push("/frecuentes")} className="hover:underline">
          Mis Medicamentos
        </button>
        <button onClick={handleLogout} className="hover:underline">
          Logout
        </button>
      </nav>
    </header>
  );
}
