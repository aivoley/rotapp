import { useState } from "react";

const jugadorasBase = [
  { nombre: "Candela", posiciones: ["Armadora"] },
  { nombre: "Miranda", posiciones: ["Armadora"] },
  { nombre: "Florencia", posiciones: ["Central", "Opuesta"] },
  { nombre: "Abril M.", posiciones: ["Opuesta"] },
  { nombre: "Micaela", posiciones: ["Punta"] },
  { nombre: "Milena", posiciones: ["Punta"] },
  { nombre: "Irina", posiciones: ["Punta", "Central"] },
  { nombre: "Sol", posiciones: ["Punta"] },
  { nombre: "Camila", posiciones: ["Central"] },
  { nombre: "Josefina", posiciones: ["Central"] },
  { nombre: "Abril S.", posiciones: ["Punta"] },
  { nombre: "Julieta A", posiciones: ["Punta", "Líbero"] },
  { nombre: "Julieta S", posiciones: ["Opuesta", "Líbero"] },
  { nombre: "Carolina", posiciones: ["Punta", "Líbero"] },
  { nombre: "Flavia", posiciones: ["Punta", "Líbero"] },
  { nombre: "Agustina", posiciones: ["Punta"] },
];

const motivosGanados = [
  "ACE", "ATAQUE", "BLOQUEO", "TOQUE", "ERROR RIVAL"
];

const motivosPerdidos = [
  "ERROR DE SAQUE", "ERROR DE ATAQUE", "BLOQUEO RIVAL", "ERROR NO FORZADO", "ERROR DE RECEPCION", "ATAQUE RIVAL", "BLOQUEO RIVAL", "SAQUE RIVAL"
];

const zonas = ["Zona 1", "Zona 6", "Zona 5", "Zona 4", "Zona 3", "Zona 2"];

export default function Simulador() {
  const [formacion, setFormacion] = useState(jugadorasBase.slice(0, 6));
  const [rotacion, setRotacion] = useState(0);
  const [puntos, setPuntos] = useState([]);
  const [motivoGanado, setMotivoGanado] = useState("");
  const [motivoPerdido, setMotivoPerdido] = useState("");
  const [jugadoraGanadora, setJugadoraGanadora] = useState(null);

  const [setActual, setSetActual] = useState(1);
  const [setsAnteriores, setSetsAnteriores] = useState<number[]>([]);
  const [puntosSetActual, setPuntosSetActual] = useState({ nuestros: 0, rivales: 0 });

  const rotar = () => {
    setFormacion(prev => [prev[5], ...prev.slice(0, 5)]);
    setRotacion(r => (r + 1) % 6);
  };

  const cargarResultado = (resultado) => {
    const punto = {
      rotacion,
      resultado,
      motivoGanado,
      motivoPerdido,
      jugadoraGanadora,
    };
    setPuntos(prev => [...prev, punto]);

    // Actualiza marcador
    if (resultado === "ganado") {
      setPuntosSetActual(prev => ({ ...prev, nuestros: prev.nuestros + 1 }));
    } else {
      setPuntosSetActual(prev => ({ ...prev, rivales: prev.rivales + 1 }));
    }
  };

  const cambiarJugadoras = () => {
    const nuevas = prompt("Escribí los nombres de las 6 jugadoras separadas por coma").split(",");
    const nuevasJugadoras = nuevas.map(nombre => jugadorasBase.find(j => j.nombre === nombre.trim())).filter(Boolean);
    if (nuevasJugadoras.length === 6) setFormacion(nuevasJugadoras);
    else alert("Revisá los nombres, debe haber 6 y coincidir con la base");
  };

  const terminarSet = () => {
    setSetsAnteriores(prev => [...prev, puntosSetActual.nuestros]);
    setSetActual(prev => prev + 1);
    setPuntosSetActual({ nuestros: 0, rivales: 0 });
  };

  return (
    <div className="flex flex-row w-full h-screen bg-green-100">
      <div className="flex flex-col justify-center items-center flex-1">
        {/* Tablero del Set */}
        <div className="mb-4 p-4 border rounded bg-white shadow">
          <h2 className="text-lg font-bold mb-2">Set {setActual}</h2>
          <p>Puntos: Nosotros {puntosSetActual.nuestros} - Rivales {puntosSetActual.rivales}</p>
          <p>Sets anteriores: {setsAnteriores.join(" - ") || "Sin datos"}</p>
        </div>

        {/* Cancha */}
        <h1 className="text-2xl font-bold mb-4">Rotación {rotacion + 1}</h1>
        <div className="grid grid-cols-3 grid-rows-2 gap-4 w-[600px] h-[400px]">
          {formacion.map((jugadora, index) => (
            <div
              key={index}
              className="flex items-center justify-center border rounded-xl bg-white text-center shadow p-2"
            >
              <div>
                <strong>{jugadora.nombre}</strong>
                <div className="text-xs text-gray-500">
                  {jugadora.posiciones.join("/")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles */}
      <div className="w-80 bg-white p-4 border-l shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Controles</h2>
        <button
          onClick={rotar}
          className="w-full bg-blue-600 text-white p-2 rounded mb-2 hover:bg-blue-700"
        >
          🔁 Rotar
        </button>
        <div className="flex flex-col gap-2 mb-4">
          <h3 className="font-semibold">Motivo de Punto Ganado</h3>
          <select
            value={motivoGanado}
            onChange={(e) => setMotivoGanado(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Selecciona un motivo</option>
            {motivosGanados.map((motivo) => (
              <option key={motivo} value={motivo}>{motivo}</option>
            ))}
          </select>
          <h3 className="font-semibold">Motivo de Punto Perdido</h3>
          <select
            value={motivoPerdido}
            onChange={(e) => setMotivoPerdido(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Selecciona un motivo</option>
            {motivosPerdidos.map((motivo) => (
              <option key={motivo} value={motivo}>{motivo}</option>
            ))}
          </select>
          <h3 className="font-semibold">Jugadora Ganadora (si aplica)</h3>
          <select
            value={jugadoraGanadora}
            onChange={(e) => setJugadoraGanadora(e.target.value)}
            className="p-2 border rounded"
          >
            <option value={null}>Ninguna</option>
            {formacion.map((jugadora, index) => (
              <option key={index} value={jugadora.nombre}>{jugadora.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => cargarResultado("ganado")}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            ✔ Punto ganado
          </button>
          <button
            onClick={() => cargarResultado("perdido")}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            ❌ Punto perdido
          </button>
          <button
            onClick={terminarSet}
            className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-2"
          >
            ✅ Terminar Set
          </button>
          <button
            onClick={cambiarJugadoras}
            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mt-2"
          >
            🔄 Cambiar Jugadoras
          </button>
        </div>

        {/* Historial de Puntos */}
        <div className="mt-4">
          <h3 className="font-semibold">Historial de Puntos</h3>
          <ul className="space-y-2">
            {puntos.map((punto, index) => (
              <li key={index} className="text-sm text-gray-700">
                {punto.resultado === "ganado" ? (
                  <>
                    {punto.jugadoraGanadora} anotó un {punto.motivoGanado} (Punto ganado)
                  </>
                ) : (
                  <>
                    {punto.motivoPerdido} (Punto perdido)
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
