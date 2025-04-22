// src/Simulador.tsx
import { useState } from "react";
import styled from "styled-components";

// Datos base
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
const motivosPerdidos = ["ERROR DE SAQUE", "ERROR DE ATAQUE", "BLOQUEO RIVAL", "ERROR NO FORZADO", "ERROR DE RECEPCION", "ATAQUE RIVAL", "SAQUE RIVAL"];

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
`;

const Cancha = styled.div`
  flex: 2;
  display: grid;
  grid-template-areas:
    "z4 z3 z2"
    "z5 z6 z1";
  gap: 10px;
  padding: 30px;
`;

const Zona = styled.div<{ area: string }>`
  grid-area: ${(props) => props.area};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid green;
  border-radius: 8px;
  background: #f8fff3;
  font-weight: bold;
`;

const JugadoraCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 5px 10px;
  text-align: center;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
`;

const Panel = styled.div`
  flex: 1;
  padding: 20px;
  background: white;
  border-left: 2px solid #ccc;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`;

export default function Simulador() {
  const [formacion, setFormacion] = useState(jugadorasBase.slice(0, 6));
  const [rotacion, setRotacion] = useState(0);
  const [setActual, setSetActual] = useState(1);
  const [setsAnteriores, setSetsAnteriores] = useState<number[][]>([]);
  const [puntosSet, setPuntosSet] = useState<[number, number]>([0, 0]);
  const [historial, setHistorial] = useState<string[]>([]);
  const [motivoGanado, setMotivoGanado] = useState("");
  const [motivoPerdido, setMotivoPerdido] = useState("");
  const [jugadoraGanadora, setJugadoraGanadora] = useState<string | null>(null);
  const [jugadorasSuplentes, setJugadorasSuplentes] = useState(jugadorasBase.slice(6));

  const zonas = [
    { area: "z1", nombre: "Zona 1" },
    { area: "z6", nombre: "Zona 6" },
    { area: "z5", nombre: "Zona 5" },
    { area: "z4", nombre: "Zona 4" },
    { area: "z3", nombre: "Zona 3" },
    { area: "z2", nombre: "Zona 2" },
  ];

  const rotar = () => {
    const nueva = [
      formacion[5], // 2 → 1
      formacion[0], // 1 → 6
      formacion[1], // 6 → 5
      formacion[2], // 5 → 4
      formacion[3], // 4 → 3
      formacion[4], // 3 → 2
    ];
    setFormacion(nueva);
    setRotacion((r) => (r + 1) % 6);
  };

  const registrarPunto = (resultado: "ganado" | "perdido") => {
    const descripcion = resultado === "ganado"
      ? `✔ ${puntosSet[0] + 1}-${puntosSet[1]}: ${motivoGanado} ${jugadoraGanadora ?? ""}`
      : `❌ ${puntosSet[0]}-${puntosSet[1] + 1}: ${motivoPerdido}`;
    setHistorial([...historial, descripcion]);
    if (resultado === "ganado") setPuntosSet([puntosSet[0] + 1, puntosSet[1]]);
    else setPuntosSet([puntosSet[0], puntosSet[1] + 1]);
    setMotivoGanado("");
    setMotivoPerdido("");
    setJugadoraGanadora(null);
  };

  const generarRotacion = () => {
    const mezcladas = [...jugadorasBase].sort(() => 0.5 - Math.random()).slice(0, 6);
    setFormacion(mezcladas);
    setRotacion(0);
    setPuntosSet([0, 0]);
    setHistorial([]);
  };

  const generarEquipo = () => {
    const equipo = [...jugadorasBase].sort(() => 0.5 - Math.random()).slice(0, 6); // Mezclar y tomar las primeras 6 jugadoras
    setFormacion(equipo); // Asignamos a la cancha
    setJugadorasSuplentes(jugadorasBase.slice(6)); // Suplentes son el resto
    setRotacion(0);
    setPuntosSet([0, 0]);
    setHistorial([]);
  };

  const cambiarJugadora = (zona: number) => {
    const jugadoraEnCancha = formacion[zona];
    const jugadoraEnBanco = jugadorasSuplentes[0]; // Seleccionamos la primera suplente (puedes hacer más dinámico si deseas)
    
    // Cambiamos las jugadoras
    const nuevaFormacion = [...formacion];
    const nuevasSuplentes = [...jugadorasSuplentes];
    
    // Reemplazamos las jugadoras
    nuevaFormacion[zona] = jugadoraEnBanco;
    nuevasSuplentes[0] = jugadoraEnCancha; // La jugadora de la cancha pasa al banco

    // Actualizamos los estados
    setFormacion(nuevaFormacion);
    setJugadorasSuplentes(nuevasSuplentes);
  };

  return (
    <Container>
      <Cancha>
        {zonas.map((zona, idx) => (
          <Zona key={zona.area} area={zona.area}>
            <JugadoraCard>
              <div>{formacion[idx]?.nombre}</div>
              <small>{formacion[idx]?.posiciones.join("/")}</small>
            </JugadoraCard>
          </Zona>
        ))}
      </Cancha>
      <Panel>
        <h2>Set {setActual}</h2>
        <div>Puntaje: {puntosSet[0]} - {puntosSet[1]}</div>
        <button onClick={rotar}>🔁 Rotar</button>
        <button onClick={generarRotacion}>🎲 Generar Rotación</button>
        <button onClick={generarEquipo}>🌀 Crear Equipo</button>
        
        <div>
          <h4>Motivo punto ganado</h4>
          <select value={motivoGanado} onChange={(e) => setMotivoGanado(e.target.value)}>
            <option value="">Seleccionar</option>
            {motivosGanados.map(m => <option key={m}>{m}</option>)}
          </select>
          <h4>Motivo punto perdido</h4>
          <select value={motivoPerdido} onChange={(e) => setMotivoPerdido(e.target.value)}>
            <option value="">Seleccionar</option>
            {motivosPerdidos.map(m => <option key={m}>{m}</option>)}
          </select>
          <h4>Jugadora destacada</h4>
          <select value={jugadoraGanadora ?? ""} onChange={(e) => setJugadoraGanadora(e.target.value)}>
            <option value="">Ninguna</option>
            {formacion.map(j => <option key={j.nombre}>{j.nombre}</option>)}
          </select>
          <button onClick={() => registrarPunto("ganado")}>✔ Punto Ganado</button>
          <button onClick={() => registrarPunto("perdido")}>❌ Punto Perdido</button>
        </div>
        
        <div>
          <h3>Historial</h3>
          <ul>{historial.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>

        <div>
          <h3>Suplentes</h3>
          <ul>
            {jugadorasSuplentes.map((j, idx) => (
              <li key={idx}>
                {j.nombre} - {j.posiciones.join("/")}
                <button onClick={() => cambiarJugadora(idx)}>👉 Cambiar</button>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </Container>
  );
}


