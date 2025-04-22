import React, { useState } from "react";
import styled from "styled-components";

interface Jugadora {
  nombre: string;
  posiciones: string[];
}

const jugadorasBase: Jugadora[] = [
  { nombre: "Martínez", posiciones: ["P"] },
  { nombre: "Gómez", posiciones: ["C"] },
  { nombre: "Rodríguez", posiciones: ["O"] },
  { nombre: "Fernández", posiciones: ["A"] },
  { nombre: "López", posiciones: ["C"] },
  { nombre: "Díaz", posiciones: ["P"] },
  { nombre: "Sánchez", posiciones: ["L"] },
  { nombre: "Torres", posiciones: ["P"] },
  { nombre: "Ramírez", posiciones: ["O"] },
  { nombre: "Pérez", posiciones: ["C"] },
  { nombre: "Silva", posiciones: ["A"] },
  { nombre: "Romero", posiciones: ["P"] },
];

const motivosGanados = ["Ataque", "Bloqueo", "Ace"];
const motivosPerdidos = ["Error", "Fallo en defensa", "Falta"];

const Simulador: React.FC = () => {
  const [formacion, setFormacion] = useState<Jugadora[]>([]);
  const [jugadorasSuplentes, setJugadorasSuplentes] = useState<Jugadora[]>(jugadorasBase);
  const [rotacion, setRotacion] = useState(0);
  const [puntosSet, setPuntosSet] = useState<[number, number]>([0, 0]);
  const [setActual, setSetActual] = useState(1);
  const [historial, setHistorial] = useState<string[]>([]);
  const [motivoGanado, setMotivoGanado] = useState("");
  const [motivoPerdido, setMotivoPerdido] = useState("");
  const [jugadoraGanadora, setJugadoraGanadora] = useState<string | null>(null);

  const zonas = [
    { area: "zona1" },
    { area: "zona6" },
    { area: "zona5" },
    { area: "zona4" },
    { area: "zona3" },
    { area: "zona2" },
  ];

  const rotar = () => {
    setFormacion(prev => {
      const nueva = [...prev];
      nueva.unshift(nueva.pop()!);
      return nueva;
    });
    setRotacion(r => (r + 1) % 6);
  };

  const registrarPunto = (tipo: "ganado" | "perdido") => {
    const nuevoHistorial = [...historial];
    if (tipo === "ganado") {
      setPuntosSet(([n, o]) => [n + 1, o]);
      nuevoHistorial.push(
        `✔ Punto ganado (${motivoGanado})${jugadoraGanadora ? " - " + jugadoraGanadora : ""}`
      );
    } else {
      setPuntosSet(([n, o]) => [n, o + 1]);
      nuevoHistorial.push(`❌ Punto perdido (${motivoPerdido})`);
    }
    setHistorial(nuevoHistorial);
    setMotivoGanado("");
    setMotivoPerdido("");
    setJugadoraGanadora(null);
  };

  const [seleccionInicial, setSeleccionInicial] = useState<{ [key: number]: string }>({});
  const [formacionConfirmada, setFormacionConfirmada] = useState(false);

  const confirmarFormacion = () => {
    const nombresSeleccionados = Object.values(seleccionInicial);
    const jugadorasSeleccionadas = nombresSeleccionados.map(nombre =>
      jugadorasBase.find(j => j.nombre === nombre)!
    );
    const suplentes = jugadorasBase.filter(j => !nombresSeleccionados.includes(j.nombre));

    setFormacion(jugadorasSeleccionadas);
    setJugadorasSuplentes(suplentes);
    setFormacionConfirmada(true);
    setPuntosSet([0, 0]);
    setHistorial([]);
    setRotacion(0);
  };

  const [jugadoraSale, setJugadoraSale] = useState<string>("");
  const [jugadoraEntra, setJugadoraEntra] = useState<string>("");

  const intercambiarJugadoras = () => {
    if (!jugadoraSale || !jugadoraEntra) return;

    const nuevaFormacion = formacion.map(j =>
      j.nombre === jugadoraSale
        ? jugadorasSuplentes.find(s => s.nombre === jugadoraEntra)!
        : j
    );

    const nuevasSuplentes = jugadorasSuplentes.map(j =>
      j.nombre === jugadoraEntra
        ? formacion.find(f => f.nombre === jugadoraSale)!
        : j
    );

    setFormacion(nuevaFormacion);
    setJugadorasSuplentes(nuevasSuplentes);
    setJugadoraSale("");
    setJugadoraEntra("");
  };

  return (
    <Container>
      {!formacionConfirmada ? (
        <Panel>
          <h2>Elegir Formación Inicial</h2>
          {[...Array(6)].map((_, idx) => (
            <div key={idx}>
              <label>Zona {idx + 1}: </label>
              <select
                value={seleccionInicial[idx] || ""}
                onChange={(e) =>
                  setSeleccionInicial({ ...seleccionInicial, [idx]: e.target.value })
                }
              >
                <option value="">Seleccionar</option>
                {jugadorasBase
                  .filter(j => !Object.values(seleccionInicial).includes(j.nombre) || seleccionInicial[idx] === j.nombre)
                  .map((j) => (
                    <option key={j.nombre} value={j.nombre}>
                      {j.nombre} ({j.posiciones.join("/")})
                    </option>
                  ))}
              </select>
            </div>
          ))}
          <button onClick={confirmarFormacion} disabled={Object.keys(seleccionInicial).length < 6}>
            Confirmar Formación
          </button>
        </Panel>
      ) : (
        <>
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

            <div>
              <h3>Motivo punto ganado</h3>
              <select value={motivoGanado} onChange={(e) => setMotivoGanado(e.target.value)}>
                <option value="">Seleccionar</option>
                {motivosGanados.map(m => <option key={m}>{m}</option>)}
              </select>
              <h3>Motivo punto perdido</h3>
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
              <h3>Cambiar Jugadoras</h3>
              <div>
                <label>Sale (cancha): </label>
                <select value={jugadoraSale} onChange={(e) => setJugadoraSale(e.target.value)}>
                  <option value="">Seleccionar</option>
                  {formacion.map(j => <option key={j.nombre}>{j.nombre}</option>)}
                </select>
              </div>
              <div>
                <label>Entra (banco): </label>
                <select value={jugadoraEntra} onChange={(e) => setJugadoraEntra(e.target.value)}>
                  <option value="">Seleccionar</option>
                  {jugadorasSuplentes.map(j => <option key={j.nombre}>{j.nombre}</option>)}
                </select>
              </div>
              <button onClick={intercambiarJugadoras}>↔ Hacer Cambio</button>
            </div>

            <div>
              <h3>Historial</h3>
              <ul>{historial.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          </Panel>
        </>
      )}
    </Container>
  );
};

export default Simulador;

// Estilos
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Cancha = styled.div`
  display: grid;
  grid-template-areas:
    "zona4 zona3 zona2"
    "zona5 zona6 zona1";
  gap: 10px;
  width: 60%;
`;

const Zona = styled.div<{ area: string }>`
  grid-area: ${(props) => props.area};
  background: #f0f0f0;
  border: 2px solid #999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const JugadoraCard = styled.div`
  background: white;
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  border-radius: 8px;
  width: 100px;
`;

const Panel = styled.div`
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;




