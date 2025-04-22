import { useLocation } from "react-router-dom";

export default function Simulacion() {
  // Usamos useLocation para acceder al estado pasado desde la pantalla anterior
  const { state } = useLocation();
  const { formacion, banco } = state || { formacion: [], banco: [] };

  return (
    <div>
      <h1>Simulación de Partido</h1>

      <h2>Formación Actual</h2>
      <div>
        {formacion.map((jugadora, index) => (
          <div key={index}>
            <strong>{jugadora.nombre}</strong> - {jugadora.posiciones.join(", ")}
          </div>
        ))}
      </div>

      <h2>Banco de Suplentes</h2>
      <div>
        {banco.map((jugadora, index) => (
          <div key={index}>
            <strong>{jugadora.nombre}</strong> - {jugadora.posiciones.join(", ")}
          </div>
        ))}
      </div>

      {/* Aquí iría el resto de la simulación */}
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "8px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        ¡Comenzar Simulación!
      </button>
    </div>
  );
}
