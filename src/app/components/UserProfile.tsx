"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import MedicamentoGrid from "./MedicamentoGrid";
import { supabase } from "@/lib/supabaseClient";

interface Medicamento {
  id: string;
  nombre: string;
  farmacias: any[];
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [frecuentes, setFrecuentes] = useState<Medicamento[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setFrecuentes([]);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("frecuentes")
      .select("medicamentos(id, nombre), medicamento_id")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (error) {
          toast.error("Error al cargar frecuentes");
        } else {
          const arr = (data ?? []).map((f: any) => ({
            id: f.medicamento_id,
            nombre: f.medicamentos?.nombre ?? "Desconocido",
            farmacias: [],
          }));
          setFrecuentes(arr);
        }
      });
  }, [user]);

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error("Error al iniciar sesión");
    else {
      toast.success("Sesión iniciada");
      setEmail(""); setPassword("");
    }
  };

  const signup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) toast.error("Error al registrarse");
    else {
      toast.success("Registro exitoso. Revisa tu correo.");
      setEmail(""); setPassword("");
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("Error al cerrar sesión");
    else {
      toast.success("Sesión cerrada");
      setUser(null);
      setFrecuentes([]);
    }
  };

  return (
    <div className="flex justify-center items-start mt-10 px-4">
      <div className="w-full max-w-md bg-gray-100 border border-gray-300 rounded-lg shadow-md p-6">
        {user ? (
          <>
            <p className="text-green-700 font-semibold mb-4">
              Sesión iniciada: {user.email}
            </p>
            <button
              onClick={logout}
              className="w-full mb-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
            >
              Cerrar sesión
            </button>

            <h3 className="text-lg font-bold mb-3 bg-blue-800 text-white p-2 rounded">
              Medicamentos frecuentes:
            </h3>
            <MedicamentoGrid medicamentos={frecuentes} />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
              Iniciar sesión
            </h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="block w-full mb-3 p-2 border border-gray-400 rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="block w-full mb-4 p-2 border border-gray-400 rounded"
            />
            <div className="flex gap-3">
              <button
                onClick={login}
                className="flex-1 bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Iniciar sesión
              </button>
              <button
                onClick={signup}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Registrarse
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
