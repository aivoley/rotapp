import { useState } from "react";
import ComenzarPartidoButton from "./ComenzarPartidoButton"; // Importa el componente del botón

export default function SelectEquipo() {
  // Aquí defines los estados para la formación y el banco de jugadoras
  const [formacion, setFormacion] = useState([
    // Aquí pondrías las jugadoras que ya están en la cancha (formación inicial)
    { nombre: "Candela", posiciones: ["Armadora"] },
    { nombre: "Miranda", posiciones: ["Armadora"] },
    { nombre: "Florencia", posiciones: ["Central"] },
    { nombre: "Abril M.", posiciones: ["Opuesta"] },
    { nombre: "Micaela", posiciones: ["Punta"] },
    { nombre: "Milena", posiciones: ["Punta"] },
  ]);

  const [banco, setBanco] = useState([
    // Aquí pondrías las jugadoras suplentes (banco)
    { nombre: "Irina", posiciones: ["Punta", "Central"] },
    { nombre: "Sol", posiciones: ["Punta"] },
    { nombre: "Camila", posiciones: ["Central"] },
    { nombre: "Josefina", posiciones: ["Central"] },
    // ...otras suplentes
  ]);

  return (
    <div>
      <h1>Selecciona tu Equipo</h1>
      {/* Aquí puedes crear una interfaz para agregar jugadoras a la formación y banco */}

      {/* Mostrar las jugadoras en la formación */}
      <div>
        <h2>Formación</h2>
        {formacion.map((jugadora, index) => (
          <div key={index}>
            {jugadora.nombre} - {jugadora.posiciones.join(", ")}
          </div>
        ))}
      </div>

      {/* Mostrar las jugadoras en el banco */}
      <div>
        <h2>Banco de Suplentes</h2>
        {banco.map((jugadora, index) => (
          <div key={index}>
            {jugadora.nombre} - {jugadora.posiciones.join(", ")}
          </div>
        ))}
      </div>

      {/* Aquí ponemos el botón para comenzar el partido */}
      <ComenzarPartidoButton formacion={formacion} banco={banco} />
    </div>
  );
}
