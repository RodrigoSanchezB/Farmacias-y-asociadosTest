import { createClient } from '@supabase/supabase-js';

// Leer URL y KEY desde variables de entorno
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { nombre } = req.query;

    const { data, error } = await supabase
      .from('medicamentos')
      .select('*')
      .ilike('nombre', `%${nombre}%`);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error consultando la base de datos' });
    }

    res.status(200).json(data);
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}