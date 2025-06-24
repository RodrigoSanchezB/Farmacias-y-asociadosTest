"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="bg-blue-800 text-white p-4 flex justify-between items-center shadow-md">
      <Link href="/">
        <h1 className="text-2xl font-bold">Farmacias y Asociados</h1>
      </Link>
      <nav className="flex gap-4 items-center">
        <Link href="/medicamentos" className="hover:underline">
          Medicamentos
        </Link>
        <Link href="/frecuentes" className="hover:underline">
          Frecuentes
        </Link>
        {user ? (
          <Link
            href="/perfil"
            className="bg-white text-blue-800 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Perfil
          </Link>
        ) : (
          <Link
            href="/login"
            className="bg-white text-blue-800 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Iniciar sesión
          </Link>
        )}
      </nav>
    </header>
  );
}
