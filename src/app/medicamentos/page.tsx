"use client";

import { useState } from "react";
import SearchBar from "@/app/components/SearchBar";
import MedicamentosCard, { Medicamento } from "@/app/components/MedicamentosCard";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export default function MedicamentosPage() {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

const handleSearch = async (nombre: string) => {
  setLoading(true);

  try {
    // Delay UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { data, error } = await supabase
      .from("medicamentos")
      .select("*")
      .ilike("nombre", `%${nombre}%`);

    if (error) {
      console.error("Error buscando medicamentos:", error.message);
      setMedicamentos([]);
    } else {
      setMedicamentos(data as Medicamento[]);

      // 🔄 Insertar en historial
      for (const med of data) {
        await supabase.from("historial_precios").insert({
          usuario: "admin@farmacias.cl", // opcional
          nombre: med.nombre,
          precio: med.precio,
        });
      }
    }
  } catch (err) {
    console.error("Error inesperado:", err);
    setMedicamentos([]);
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
        Buscar medicamentos
      </h1>

      <div className="max-w-2xl mx-auto">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {loading ? (
          <p className="text-center text-blue-600 text-lg mt-10">
            Cargando medicamentos...
          </p>
        ) : medicamentos.length > 0 ? (
          medicamentos.map((med) => (
            <MedicamentosCard key={med.id} medicamento={med} />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No se han encontrado medicamentos.
          </p>
        )}
      </div>
    </main>
  );
}