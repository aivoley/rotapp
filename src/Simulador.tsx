import React, { useState } from "react";
import styled from "styled-components";

// Tipos y datos base
type Jugadora = {
  nombre: string;
  posiciones: string[];
};

type Punto = {
  resultado: "ganado" | "perdido";
  motivo: string;
  jugadora?: string;
};

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

const equipoEjemplo: Jugadora[] = [
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
];

// Estilos
const Cancha = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 120px);
  grid-template-rows: repeat(2, 120px);
  gap: 10px;
  background-color: #e6f4ea;
  padding: 20px;
  border-radius: 10px;
`;

const JugadoraBox = styled.div`
  background-color: #ffffff;
  border: 2px solid #4caf50;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`;

const Panel = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border-left: 2px solid #ccc;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 320px;
`;

export default function Simulador() {
  const [cancha, setCancha] = useState<Jugadora[]>(equipoEjemplo.slice(0, 6));
  const [banco, setBanco] = useState<Jugadora[]>(equipoEjemplo.slice(6));
  const [puntos, setPuntos] = useState<Punto[]>([]);
  const [motivo, setMotivo] = useState("");
  const [jugadora, setJugadora] = useState<string>("");
  const [cambioIn, setCambioIn] = useState("");
  const [cambioOut, setCambioOut] = useState("");

  const cargarPunto = (resultado: "ganado" | "perdido") => {
    if (!motivo) return;
    setPuntos((prev) => [
      ...prev,
      { resultado, motivo, jugadora: jugadora || undefined },
    ]);
    setMotivo("");
    setJugadora("");
  };

  const cambiarJugadora = () => {
    const entra = banco.find((j) => j.nombre === cambioIn);
    const sale = cancha.find((j) => j.nombre === cambioOut);
    if (!entra || !sale) return;

    setCancha((prev) =>
      prev.map((j) => (j.nombre === cambioOut ? entra : j))
    );
    setBanco((prev) =>
      prev.map((j) => (j.nombre === cambioIn ? sale : j))
    );
    setCambioIn("");
    setCambioOut("");
  };

  const resumen = puntos.reduce(
    (acc, punto) => {
      if (punto.resultado === "ganado") acc.ganados++;
      else acc.perdidos++;

      if (punto.motivo === "ACE") acc.aces++;
      if (punto.motivo === "ATAQUE") acc.ataques++;
      if (punto.motivo === "BLOQUEO") acc.bloqueos++;
      return acc;
    },
    { ganados: 0, perdidos: 0, aces: 0, ataques: 0, bloqueos: 0 }
  );

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, padding: 20 }}>
        <h1>Simulador de Rotaciones</h1>
        <Cancha>
          {cancha.map((jug, i) => (
            <JugadoraBox key={i}>
              {jug.nombre}
              <div style={{ fontSize: "0.8rem", color: "#555" }}>
                {jug.posiciones.join("/")}
              </div>
            </JugadoraBox>
          ))}
        </Cancha>

        <h3>Historial de Puntos</h3>
        <ul>
          {puntos.map((p, i) => (
            <li key={i}>
              {p.resultado === "ganado" ? "✔" : "✖"} {p.motivo}
              {p.jugadora && ` - ${p.jugadora}`}
            </li>
          ))}
        </ul>
      </div>

      <Panel>
        <h2>Control</h2>

        <label>Motivo</label>
        <select value={motivo} onChange={(e) => setMotivo(e.target.value)}>
          <option value="">Selecciona</option>
          {[...motivosGanados, ...motivosPerdidos].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <label>Jugadora (opcional)</label>
        <select
          value={jugadora}
          onChange={(e) => setJugadora(e.target.value)}
        >
          <option value="">--</option>
          {cancha.map((j) => (
            <option key={j.nombre} value={j.nombre}>
              {j.nombre}
            </option>
          ))}
        </select>

        <button onClick={() => cargarPunto("ganado")}>✔ Punto ganado</button>
        <button onClick={() => cargarPunto("perdido")}>✖ Punto perdido</button>

        <h3>Cambiar jugadoras</h3>
        <label>Sale</label>
        <select
          value={cambioOut}
          onChange={(e) => setCambioOut(e.target.value)}
        >
          <option value="">--</option>
          {cancha.map((j) => (
            <option key={j.nombre} value={j.nombre}>
              {j.nombre}
            </option>
          ))}
        </select>

        <label>Entra</label>
        <select
          value={cambioIn}
          onChange={(e) => setCambioIn(e.target.value)}
        >
          <option value="">--</option>
          {banco.map((j) => (
            <option key={j.nombre} value={j.nombre}>
              {j.nombre}
            </option>
          ))}
        </select>
        <button onClick={cambiarJugadora}>↔ Cambiar</button>

        <h3>Resumen</h3>
        <p>Puntos ganados: {resumen.ganados}</p>
        <p>Puntos perdidos: {resumen.perdidos}</p>
        <p>Aces: {resumen.aces}</p>
        <p>Ataques: {resumen.ataques}</p>
        <p>Bloqueos: {resumen.bloqueos}</p>
      </Panel>
    </div>
  );
}

