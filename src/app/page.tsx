"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl md:text-5xl font-bold text-blue-800 mb-6">
        ¡Bienvenido a Farmacias y Asociados!
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
        Compara precios de medicamentos entre distintas farmacias de manera fácil y rápida.
        Encuentra la mejor oferta para cuidar tu salud y tu bolsillo.
      </p>
      <button
        onClick={() => router.push("/medicamentos")}
        className="mt-8 px-8 py-4 bg-blue-600 text-white text-lg rounded-full hover:bg-blue-700 transition-all"
      >
        Buscar medicamentos
      </button>
    </main>
  );
}

