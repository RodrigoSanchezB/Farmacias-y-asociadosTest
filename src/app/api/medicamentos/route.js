
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const nombre = searchParams.get("nombre");

  if (!nombre) {
    return NextResponse.json({ error: "Debe enviar el nombre del medicamento" }, { status: 400 });
  }

  const { data: medicamentos, error: errorMedicamento } = await supabase
    .from("medicamentos")
    .select("id, nombre")
    .ilike("nombre", `%${nombre}%`);

  console.log("🔍 Medicamentos encontrados:", medicamentos);

  if (errorMedicamento) {
    return NextResponse.json({ error: errorMedicamento.message }, { status: 500 });
  }

  if (!medicamentos || medicamentos.length === 0) {
    return NextResponse.json({ mensaje: "No se encontraron medicamentos" }, { status: 404 });
  }

  const ids = medicamentos.map((m) => m.id);

  const { data: precios, error: errorPrecios } = await supabase
    .from("precios")
    .select(`
      medicamento_id,
      precio,
      fecha,
      farmacia: farmacias (
        id,
        nombre,
        direccion
      )
    `)
    .in("medicamento_id", ids);

  if (errorPrecios) {
    return NextResponse.json({ error: errorPrecios.message }, { status: 500 });
  }

  const resultado = medicamentos.map((med) => {
    const preciosMed = precios.filter((p) => p.medicamento_id === med.id);

    return {
      id: med.id,
      nombre: med.nombre,
      farmacias: preciosMed
        .filter((p) => p.farmacia)
        .map((p) => ({
          nombre: p.farmacia.nombre,
          direccion: p.farmacia.direccion,
          precio: p.precio,
          fecha: p.fecha,
        })),
    };
  });

  return NextResponse.json(resultado);
}
