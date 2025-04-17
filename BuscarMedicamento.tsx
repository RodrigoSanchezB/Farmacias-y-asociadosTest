'use client'

import { useState } from 'react'

export default function BuscarMedicamento() {
  const [nombre, setNombre] = useState('')
  const [resultados, setResultados] = useState([])

  const buscarMedicamento = async () => {
    const res = await fetch(`/api/medicamentos?nombre=${encodeURIComponent(nombre)}`)
    const data = await res.json()
    setResultados(data)
  }

  return (
    <div className="p-4">
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Buscar medicamento"
        className="border p-2 mr-2"
      />
      <button onClick={buscarMedicamento} className="bg-blue-600 text-white px-4 py-2 rounded">
        Buscar
      </button>

      <ul className="mt-4 space-y-2">
        {resultados.map((item, idx) => (
          <li key={idx} className="border p-2 rounded shadow">
            <strong>{item.nombre}</strong> - ${item.precio} <br />
            Stock: {item.stock} <br />
            {item.farmacia} - {item.direccion}
          </li>
        ))}
      </ul>
    </div>
  )
}
