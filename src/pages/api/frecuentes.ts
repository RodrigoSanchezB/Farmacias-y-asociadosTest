import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user_id, medicamento_id } = req.body;

  if (req.method === "POST") {
    const { data, error } = await supabase
      .from("frecuentes")
      .insert([{ user_id, medicamento_id }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ mensaje: "Agregado a frecuentes" });
  }

  if (req.method === "DELETE") {
    const { data, error } = await supabase
      .from("frecuentes")
      .delete()
      .eq("user_id", user_id)
      .eq("medicamento_id", medicamento_id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ mensaje: "Eliminado de frecuentes" });
  }

  return res.status(405).json({ error: "Método no permitido" });
}