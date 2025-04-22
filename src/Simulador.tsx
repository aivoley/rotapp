import { useState } from "react";
import styled from "styled-components";

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

const motivosGanados = ["ACE", "ATAQUE", "BLOQUEO", "TOQUE", "ERROR RIVAL"];
const motivosPerdidos = [
  "ERROR DE SAQUE",
  "ERROR DE ATAQUE",
  "BLOQUEO RIVAL",
  "ERROR NO FORZADO",
  "ERROR DE RECEPCION",
  "ATAQUE RIVAL",
  "SAQUE RIVAL",
];

const zonas = ["Zona 1", "Zona 6", "Zona 5", "Zona 4", "Zona 3", "Zona 2"];

const Cancha = styled.div`
  width: 600px;
  height: 400px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
  background: #e0f7fa;
  padding: 10px;
  border-radius: 10px;
`;

const Jugadora = styled.div`
  background: white;
  border-radius: 8px;
  padding: 6px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Lateral = styled.div`
  width: 320px;
  background: white;
  padding: 16px;
  border-left: 1px solid #ccc;
  overflow-y: auto;
`;

export default function Simulador() {
  const [formacion, setFormacion] = useState(jugadorasBase.slice(0, 6));
  const [rotacion, setRotacion] = useState(0);
  const [setActual, setSetActual] = useState(1);
  const [sets, setSets] = useState([]);
  const [puntosActual, setPuntosActual] = useState({ nosotros: 0, rival: 0 });
  const [historialPuntos, setHistorialPuntos] = useState([]);
  const [motivoGanado, setMotivoGanado] = useState("");
  const [motivoPerdido, setMotivoPerdido] = useState("");
  const [jugadoraGanadora, setJugadoraGanadora] = useState("");

  const rotar = () => {
    setFormacion((prev) => [prev[5], ...prev.slice(0, 5)]);
    setRotacion((r) => (r + 1) % 6);
  };

  const cargarResultado = (resultado) => {
    const punto = {
      set: setActual,
      rotacion,
      resultado,
      motivo:
        resultado === "ganado" ? motivoGanado : motivoPerdido,
      jugadora: resultado === "ganado" ? jugadoraGanadora : null,
    };

    setHistorialPuntos((prev) => [...prev, punto]);

    if (resultado === "ganado") {
      setPuntosActual((prev) => ({ ...prev, nosotros: prev.nosotros + 1 }));
    } else {
      setPuntosActual((prev) => ({ ...prev, rival: prev.rival + 1 }));
    }

    setMotivoGanado("");
    setMotivoPerdido("");
    setJugadoraGanadora("");
  };

  const finalizarSet = () => {
    setSets((prev) => [
      ...prev,
      {
        set: setActual,
        puntos: puntosActual,
        historial: historialPuntos,
      },
    ]);
    setSetActual((prev) => prev + 1);
    setPuntosActual({ nosotros: 0, rival: 0 });
    setHistorialPuntos([]);
  };

  return (
    <div className="flex flex-row w-full h-screen bg-green-50">
      <div className="flex flex-col justify-center items-center flex-1 p-4">
        <h1 className="text-2xl font-bold mb-2">Set {setActual}</h1>
        <div className="flex gap-4 items-center mb-4">
          <div className="text-lg font-semibold">Nosotros: {puntosActual.nosotros}</div>
          <div className="text-lg font-semibold">Rival: {puntosActual.rival}</div>
          <button
            onClick={finalizarSet}
            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
          >
            Finalizar Set
          </button>
        </div>

        <Cancha>
          {formacion.map((jugadora, index) => (
            <Jugadora key={index}>
              <strong>{jugadora.nombre}</strong>
              <div className="text-xs text-gray-500">
                {jugadora.posiciones.join("/")}
              </div>
            </Jugadora>
          ))}
        </Cancha>
      </div>

      <Lateral>
        <h2 className="text-xl font-semibold mb-4">Controles</h2>
        <button
          onClick={rotar}
          className="w-full bg-blue-600 text-white p-2 rounded mb-3 hover:bg-blue-700"
        >
          🔁 Rotar
        </button>

        <div className="mb-4">
          <label className="font-semibold">Motivo punto ganado</label>
          <select
            value={motivoGanado}
            onChange={(e) => setMotivoGanado(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona</option>
            {motivosGanados.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Motivo punto perdido</label>
          <select
            value={motivoPerdido}
            onChange={(e) => setMotivoPerdido(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona</option>
            {motivosPerdidos.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Jugadora destacada</label>
          <select
            value={jugadoraGanadora}
            onChange={(e) => setJugadoraGanadora(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Ninguna</option>
            {formacion.map((j) => (
              <option key={j.nombre} value={j.nombre}>{j.nombre}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => cargarResultado("ganado")}
            className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            ✔ Ganado
          </button>
          <button
            onClick={() => cargarResultado("perdido")}
            className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            ✘ Perdido
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Sets anteriores</h3>
          {sets.map((s) => (
            <div key={s.set} className="mb-2 border p-2 rounded bg-gray-100">
              <strong>Set {s.set}</strong><br />
              Nosotros: {s.puntos.nosotros} - Rival: {s.puntos.rival}
              <ul className="text-sm list-disc list-inside mt-1">
                {s.historial.map((p, i) => (
                  <li key={i}>
                    {p.resultado === "ganado" ? "✔" : "✘"} {p.motivo} {p.jugadora && `- ${p.jugadora}`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Lateral>
    </div>
  );
}

