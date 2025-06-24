"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useLanguage } from "@/app/context/LanguageContext";
import { Medicamento } from "@/app/components/MedicamentosCard";
import MedicamentoGrid from "@/app/components/MedicamentoGrid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FrecuentesPage() {
  const { lang } = useLanguage();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrecuentes = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setMedicamentos([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("frecuentes")
        .select(`
          medicamento: medicamentos (
            id,
            nombre,
            precios: precios (
              precio,
              fecha,
              farmacia: farmacias (
                nombre,
                direccion
              )
            )
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching frecuentes:", error.message);
        setMedicamentos([]);
      } else if (data) {
        const meds: Medicamento[] = data.map((item: any) => ({
          id: item.medicamento.id,
          nombre: item.medicamento.nombre,
          farmacias: item.medicamento.precios.map((p: any) => ({
            nombre: p.farmacia.nombre,
            direccion: p.farmacia.direccion,
            precio: p.precio,
            fecha: p.fecha,
          })),
        }));
        setMedicamentos(meds);
      }
      setLoading(false);
    };

    fetchFrecuentes();
  }, []);

  const translations = {
    es: {
      title: "Medicamentos frecuentes",
      loading: "Cargando medicamentos...",
      noFrecuentes: "No tienes medicamentos guardados.",
    },
    en: {
      title: "Favorite medications",
      loading: "Loading medications...",
      noFrecuentes: "You have no saved medications.",
    },
  };

  const t = translations[lang];

  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      {loading ? (
        <p>{t.loading}</p>
      ) : medicamentos.length === 0 ? (
        <p>{t.noFrecuentes}</p>
      ) : (
        <MedicamentoGrid medicamentos={medicamentos} />
      )}
    </main>
  );
}
