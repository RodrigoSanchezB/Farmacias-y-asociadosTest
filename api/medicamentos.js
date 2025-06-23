import { createClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { nombre } = req.query;

  if (!nombre) {
    return res.status(400).json({ error: 'Debe enviar el nombre del medicamento' });
  }

  // 1. Buscar el medicamento por nombre (coincidencia parcial)
  const { data: medicamentos, error: errorMedicamento } = await supabase
    .from('medicamentos')
    .select('id, nombre')
    .ilike('nombre', `%${nombre}%`);

  if (errorMedicamento) {
    return res.status(500).json({ error: errorMedicamento.message });
  }

  if (medicamentos.length === 0) {
    return res.status(404).json({ mensaje: 'No se encontraron medicamentos' });
  }

  // 2. Obtener precios asociados por farmacia para cada medicamento
  const ids = medicamentos.map((m) => m.id);

  const { data: precios, error: errorPrecios } = await supabase
    .from('precios')
    .select(`
      medicamento_id,
      precio,
      fecha,
      farmacias ( id, nombre, direccion )
    `)
    .in('medicamento_id', ids);

  if (errorPrecios) {
    return res.status(500).json({ error: errorPrecios.message });
  }

  // 3. Agrupar resultados
  const resultado = medicamentos.map((med) => {
    const preciosMed = precios.filter((p) => p.medicamento_id === med.id);

    return {
      id: med.id,
      nombre: med.nombre,
      farmacias: preciosMed.map((p) => ({
        nombre: p.farmacias.nombre,
        direccion: p.farmacias.direccion,
        precio: p.precio,
        fecha: p.fecha,
      }))
    };
  });

  return res.status(200).json(resultado);
}