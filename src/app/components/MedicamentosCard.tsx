"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";  // <-- Importa el cliente aquí
import { toast } from "react-toastify";

export interface Medicamento {
  id: string;
  nombre: string;
  farmacias: {
    nombre: string;
    direccion: string;
    precio: number;
    fecha: string;
  }[];
}

export default function MedicamentosCard({ medicamento }: { medicamento: Medicamento }) {
  const { lang } = useLanguage();
  const [guardado, setGuardado] = useState(false);
  const [user, setUser] = useState<null | { id: string }>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setGuardado(false);
      return;
    }

    const verificarGuardado = async () => {
      const { data: existentes, error } = await supabase
        .from("frecuentes")
        .select("*")
        .eq("user_id", user.id)
        .eq("medicamento_id", medicamento.id);

      if (error) {
        console.error("Error al verificar frecuentes:", error.message);
        return;
      }

      setGuardado((existentes ?? []).length > 0);
    };

    verificarGuardado();
  }, [medicamento.id, user]);

  const toggleFrecuente = async () => {
    if (!user) {
      toast.error(lang === "es" ? "Debes iniciar sesión" : "You must log in");
      return;
    }

    try {
      const response = await fetch("/api/frecuentes", {
        method: guardado ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, medicamento_id: medicamento.id }),
      });

      if (!response.ok) throw new Error("Error al guardar/eliminar");

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
    } catch (err) {
      toast.error(
        lang === "es"
          ? "Hubo un error al actualizar frecuentes"
          : "Failed to update favorites"
      );
    }
  };

  const translations = {
    es: {
      price: "Precio",
      drugstore: "Farmacia",
      save: "Guardar en frecuentes",
      saved: "Eliminar de frecuentes",
    },
    en: {
      price: "Price",
      drugstore: "Drugstore",
      save: "Save to favorites",
      saved: "Remove from favorites",
    },
  };

  const t = translations[lang];

  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg transition-all mb-4">
      <h2 className="text-xl font-bold text-blue-700 mb-2">{medicamento.nombre}</h2>

      {medicamento.farmacias.map((f, i) => (
        <div key={i} className="bg-gray-50 p-3 rounded mb-2">
          <p className="text-gray-800 font-semibold">{t.drugstore}: {f.nombre}</p>
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
