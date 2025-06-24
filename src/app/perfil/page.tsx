"use client";

import MedicamentoGrid from "@/app/components/MedicamentoGrid";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Medicamento } from "@/app/components/MedicamentosCard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PerfilPage() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrecuentes = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("frecuentes")
        .select("medicamentos ( id, nombre, precios ( precio, fecha, farmacias ( nombre, direccion ) ) )")
        .eq("user_id", user.id);

      if (error || !data) {
        setMedicamentos([]);
        setLoading(false);
        return;
      }

      const transformados: Medicamento[] = data.map((item: any) => ({
        id: item.medicamentos.id,
        nombre: item.medicamentos.nombre,
        farmacias: item.medicamentos.precios.map((p: any) => ({
          nombre: p.farmacias.nombre,
          direccion: p.farmacias.direccion,
          precio: p.precio,
          fecha: p.fecha,
        })),
      }));

      setMedicamentos(transformados);
      setLoading(false);
    };

    fetchFrecuentes();
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando...</p>;

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tus Medicamentos Frecuentes</h1>
      <MedicamentoGrid medicamentos={medicamentos} />
    </main>
  );
}
