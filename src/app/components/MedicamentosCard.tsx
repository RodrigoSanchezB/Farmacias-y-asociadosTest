"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

export interface Pharmacy {
  nombre: string;
  direccion: string;
  precio: number;
  fecha: string;
  latitud?: number;
  longitud?: number;
  distance?: number;
  nearby?: boolean;
}

export interface Medicamento {
  id: string;
  nombre: string;
  farmacias: Pharmacy[];
}

export default function MedicamentosCard({ medicamento }: { medicamento: Medicamento }) {
  const { lang } = useLanguage();
  const [guardado, setGuardado] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => {
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return setGuardado(false);
    supabase
      .from("frecuentes")
      .select()
      .eq("user_id", user.id)
      .eq("medicamento_id", medicamento.id)
      .then(({ data, error }) => {
        if (!error) setGuardado((data ?? []).length > 0);
      });
  }, [medicamento.id, user]);

  const toggleFrecuente = async () => {
    if (!user) return toast.error(lang === "es" ? "Debes iniciar sesión" : "You must log in");
    try {
      const res = await fetch("/api/frecuentes", {
        method: guardado ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, medicamento_id: medicamento.id }),
      });
      if (!res.ok) throw new Error();
      toast.success(
        lang === "es"
          ? guardado
            ? "Eliminado de frecuentes"
            : "Guardado en frecuentes"
          : guardado
          ? "Removed from favorites"
          : "Saved to favorites"
      );
      setGuardado(!guardado);
    } catch {
      toast.error(lang === "es" ? "Hubo un error al actualizar frecuentes" : "Failed to update favorites");
    }
  };

  const t = {
    es: { price: "Precio", drugstore: "Farmacia", save: "Guardar en frecuentes", saved: "Eliminar de frecuentes" },
    en: { price: "Price", drugstore: "Drugstore", save: "Save to favorites", saved: "Remove from favorites" },
  }[lang];

  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg transition-all mb-4">
      <h2 className="text-xl font-bold text-blue-700 mb-2">{medicamento.nombre}</h2>

      {medicamento.farmacias.map((f, i) => (
        <div
          key={i}
          className={`p-3 rounded mb-2 ${
            f.nearby ? "bg-green-100 border border-green-400" : "bg-gray-50"
          }`}
        >
          <p className="text-gray-800 font-semibold">
            {t.drugstore}: {f.nombre}
            {f.nearby && (
              <span className="ml-2 text-sm text-green-700">¡Cerca! ({f.distance?.toFixed(1)} km)</span>
            )}
          </p>
          <p className="text-gray-600">{f.direccion}</p>
          <p className="text-gray-600">{t.price}: ${f.precio.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Actualizado: {f.fecha}</p>
        </div>
      ))}

      <button
        onClick={toggleFrecuente}
        className={`mt-4 px-4 py-2 rounded text-white ${
          guardado ? "bg-red-600 hover:bg-red-500" : "bg-blue-800 hover:bg-blue-700"
        }`}
      >
        {guardado ? t.saved : t.save}
      </button>
    </div>
  );
}
