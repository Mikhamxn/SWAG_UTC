import React, { useEffect, useState } from 'react'

function Materias() {
  const [lstMaterias, setLstMaterias] = useState([])

  useEffect(() => {
    // Simulación de llamada a API
    const datos = [
      {
        intMateria: 1,
        strClave: "MAT101",
        strNombre: "Matemáticas Básicas",
        intTotalSesiones: 40
      },
      {
        intMateria: 2,
        strClave: "HIS201",
        strNombre: "Historia Universal",
        intTotalSesiones: 30
      }
    ]
    setLstMaterias(datos)
  }, [])

  console.log(lstMaterias)

  return (
    <>
      <form>
        <h2>Listado de Materias</h2>

        {lstMaterias.length === 0 ? (
          <p>No hay materias registradas.</p>
        ) : (
          lstMaterias.map((x) => (
            <div key={x.intMateria} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <p><strong>ID:</strong> {x.intMateria}</p>
              <p><strong>Clave:</strong> {x.strClave}</p>
              <p><strong>Nombre:</strong> {x.strNombre}</p>
              <p><strong>Total de sesiones:</strong> {x.intTotalSesiones}</p>
            </div>
          ))
        )}
      </form>
    </>
  )
}

export default Materias
