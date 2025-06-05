"use client";

import { useState } from "react";
import SearchBar from "@/app/components/SearchBar";
import MedicamentosCard, { Medicamento } from "@/app/components/MedicamentosCard";
import { useLanguage } from "@/app/context/LanguageContext"; // ✅ Ruta corregida


/*import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);*/
export default function MedicamentosPage() {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
//const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { lang } = useLanguage();

  // Datos de ejemplo
  const medicamentos = [
    {
      id: "1",
      nombre: "Paracetamol",
      imagen: "/paracetamol.jpg",
      tienda: "Cruz Verde",
      precio: "2.700",
    },
    {
      id: "2",
      nombre: "Paracetamol",
      imagen: "/Paracetamol.jpg",
      tienda: "Ahumada",
      precio: "3.200",
    },
    {
      id: "3",
      nombre: "Paracetamol",
      imagen: "/Paracetamol.jpg",
      tienda: "Salco Brand",
      precio: "3.100",
    },
    // más medicamentos...
  ];

  const handleSearch = async (nombre: string) => {
    setLoading(true);

    try {
      // Agregar un pequeño delay de 1000ms para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      /*const { data, error } = await supabase
        .from('medicamentos')
        .select('*')
        .ilike('nombre', `%${nombre}%`); // Búsqueda sin case sensitive

      if (error) {
        console.error('Error buscando medicamentos:', error.message);
        setMedicamentos([]);
      } else {
        setMedicamentos(data as Medicamento[]);
      }*/
    } catch (err) {
      console.error('Error inesperado:', err);
      //setMedicamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    es: {
      title: 'Buscar medicamentos',
      searchButton: 'Buscar',
    },
    en: {
      title: 'Search for medications',
      searchButton: 'Search',
    },
  };

  const t = translations[lang];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
        {t.title}
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