import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

const motivosGanado = ["ACE", "ATAQUE", "BLOQUEO", "TOQUE", "ERROR RIVAL"];
const motivosPerdido = [
  "ERROR DE SAQUE",
  "ERROR DE ATAQUE",
  "BLOQUEO RIVAL",
  "ERROR NO FORZADO",
  "ERROR DE RECEPCION",
  "ATAQUE RIVAL",
  "BLOQUEO RIVAL",
  "SAQUE RIVAL",
];

export default function Simulador() {
  const [formacion, setFormacion] = useState(jugadorasBase.slice(0, 6));
  const [rotacion, setRotacion] = useState(0);
  const [puntos, setPuntos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [tipoPunto, setTipoPunto] = useState("ganado");
  const [motivo, setMotivo] = useState("");
  const [jugadoraPunto, setJugadoraPunto] = useState("");
  const [equipoNombre, setEquipoNombre] = useState("Mi Equipo");
  const [fechaPartido, setFechaPartido] = useState(
    new Date().toISOString().split("T")[0]
  );

  const rotar = () => {
    setFormacion((prev) => [prev[5], ...prev.slice(0, 5)]);
    setRotacion((r) => (r + 1) % 6);
  };

  const cargarResultado = () => {
    if (!motivo) return alert("Seleccioná un motivo.");
    const nuevoPunto = {
      rotacion,
      resultado: tipoPunto,
      motivo,
      jugadora: tipoPunto === "ganado" ? jugadoraPunto : null,
    };
    setPuntos((prev) => [...prev, nuevoPunto]);
    setHistorico((prev) => [...prev, nuevoPunto]);
    setMotivo("");
    setJugadoraPunto("");
  };

  const exportarMatch = () => {
    const matchData = {
      equipo: equipoNombre,
      fecha: fechaPartido,
      datos: historico,
    };
    const blob = new Blob([JSON.stringify(matchData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `match_${equipoNombre}_${fechaPartido}.json`;
    a.click();
  };

  const importarMatch = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = JSON.parse(reader.result);
      setEquipoNombre(data.equipo || "Equipo Importado");
      setFechaPartido(data.fecha || new Date().toISOString().split("T")[0]);
      setHistorico(data.datos || []);
      setPuntos(data.datos || []);
    };
    reader.readAsText(file);
  };

  const estadisticas = puntos.reduce((acc, punto) => {
    const clave = `R${punto.rotacion + 1}`;
    acc[clave] = acc[clave] || { ganado: 0, perdido: 0 };
    acc[clave][punto.resultado]++;
    return acc;
  }, {});

  const dataEstadisticas = Object.entries(estadisticas).map(([rot, val]) => ({
    rotacion: rot,
    ganado: val.ganado || 0,
    perdido: val.perdido || 0,
  }));

  return (
    <div className="flex flex-row w-full h-screen bg-green-100">
      <div className="flex flex-col justify-center items-center flex-1">
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

      <div className="w-96 bg-white p-4 border-l shadow-xl overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Controles</h2>
        <button
          onClick={rotar}
          className="w-full bg-blue-600 text-white p-2 rounded mb-2 hover:bg-blue-700"
        >
          🔁 Rotar
        </button>

        <h3 className="mt-4 font-semibold">Nuevo Punto</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Resultado</label>
          <select
            className="w-full border p-1 rounded"
            value={tipoPunto}
            onChange={(e) => setTipoPunto(e.target.value)}
          >
            <option value="ganado">✔ Ganado</option>
            <option value="perdido">❌ Perdido</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium">Motivo</label>
          <select
            className="w-full border p-1 rounded"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {(tipoPunto === "ganado" ? motivosGanado : motivosPerdido).map(
              (m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              )
            )}
          </select>
        </div>

        {tipoPunto === "ganado" && (
          <div className="mb-2">
            <label className="block text-sm font-medium">Jugadora</label>
            <select
              className="w-full border p-1 rounded"
              value={jugadoraPunto}
              onChange={(e) => setJugadoraPunto(e.target.value)}
            >
              <option value="">Sin asignar</option>
              {jugadorasBase.map((j) => (
                <option key={j.nombre} value={j.nombre}>
                  {j.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={cargarResultado}
          className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700"
        >
          ➕ Agregar Punto
        </button>

        <h3 className="mt-4 font-semibold">Historial</h3>
        <ul className="text-sm max-h-40 overflow-y-auto space-y-1">
          {puntos.map((p, i) => (
            <li key={i} className="flex flex-col border rounded p-1 bg-gray-50">
              <div>
                <strong>R{p.rotacion + 1}</strong> —{" "}
                {p.resultado === "ganado" ? "✔ Ganado" : "❌ Perdido"}
              </div>
              <div className="text-xs text-gray-700">
                Motivo: <em>{p.motivo}</em>
                {p.resultado === "ganado" && p.jugadora
                  ? ` — Jugadora: ${p.jugadora}`
                  : ""}
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-4 font-semibold">Estadísticas</h3>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataEstadisticas}>
              <XAxis dataKey="rotacion" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ganado" fill="#22c55e" />
              <Bar dataKey="perdido" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="mt-4 font-semibold">Match</h3>
        <div className="mb-2">
          <label className="text-sm font-medium">Equipo</label>
          <input
            value={equipoNombre}
            onChange={(e) => setEquipoNombre(e.target.value)}
            className="w-full border p-1 rounded"
          />
        </div>
        <div className="mb-2">
          <label className="text-sm font-medium">Fecha</label>
          <input
            type="date"
            value={fechaPartido}
            onChange={(e) => setFechaPartido(e.target.value)}
            className="w-full border p-1 rounded"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={exportarMatch}
            className="bg-gray-700 text-white p-2 rounded hover:bg-gray-800"
          >
            ⬇ Exportar Match
          </button>
          <input
            type="file"
            accept="application/json"
            onChange={importarMatch}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}

