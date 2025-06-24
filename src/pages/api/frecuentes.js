import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Falta el ID de usuario" });
  }

  const { data, error } = await supabase
    .from("frecuentes")
    .select(`
      medicamento_id,
      medicamentos (
        id,
        nombre,
        precios (
          precio,
          fecha,
          farmacias (
            nombre,
            direccion
          )
        )
      )
    `)
    .eq("user_id", user_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const formateado = data.map((item) => {
    const medicamento = item.medicamentos;
    return {
      id: medicamento.id,
      nombre: medicamento.nombre,
      farmacias: medicamento.precios.map((p) => ({
        nombre: p.farmacias.nombre,
        direccion: p.farmacias.direccion,
        precio: p.precio,
        fecha: p.fecha,
      })),
    };
  });

  return res.status(200).json(formateado);
}
