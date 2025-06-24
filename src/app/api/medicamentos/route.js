import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  const { data: medicamentos, error: errMed } = await supabase
    .from("medicamentos")
    .select("id, nombre")
    .ilike("nombre", `%${nombre}%`);
  if (errMed) return NextResponse.json({ error: errMed.message }, { status: 500 });
  if (!medicamentos?.length) {
    return NextResponse.json({ mensaje: "No se encontraron medicamentos" }, { status: 404 });
  }

  const ids = medicamentos.map((m) => m.id);
  const { data: precios, error: errPre } = await supabase
    .from("precios")
    .select(`
      medicamento_id,
      precio,
      fecha,
      farmacia: farmacias (
        id,
        nombre,
        direccion,
        latitud,
        longitud
      )
    `)
    .in("medicamento_id", ids);
  if (errPre) return NextResponse.json({ error: errPre.message }, { status: 500 });

  const resultado = medicamentos.map((med) => {
    const preciosMed = precios.filter((p) => p.medicamento_id === med.id);
    return {
      id: med.id,
      nombre: med.nombre,
      farmacias: preciosMed.map((p) => ({
        nombre: p.farmacia.nombre,
        direccion: p.farmacia.direccion,
        precio: p.precio,
        fecha: p.fecha,
        latitud: p.farmacia.latitud,
        longitud: p.farmacia.longitud,
      })),
    };
  });

  return NextResponse.json(resultado);
}
