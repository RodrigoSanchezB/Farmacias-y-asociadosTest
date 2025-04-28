"use client";

import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (nombre: string) => void }) {
  const [nombre, setNombre] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim() !== "") {
      onSearch(nombre);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-4">
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Buscar medicamento..."
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Buscar
      </button>
    </form>
  );
}
