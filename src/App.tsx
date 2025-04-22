import { useState } from "react";
import styled from "styled-components";

type Jugadora = {
  nombre: string;
  posiciones: string[];
};

type Punto = {
  rotacion: number;
  resultado: "ganado" | "perdido";
  motivoGanado?: string;
  motivoPerdido?: string;
  jugadoraGanadora?: string | null;
};

const jugadorasBase: Jugadora[] = [
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

export default function app() {
  const [formacion, setFormacion] = useState<Jugadora[]>(jugadorasBase.slice(0, 6));
  const [rotacion, setRotacion] = useState(0);
  const [puntos, setPuntos] = useState<Punto[]>([]);
  const [motivoGanado, setMotivoGanado] = useState("");
  const [motivoPerdido, setMotivoPerdido] = useState("");
  const [jugadoraGanadora, setJugadoraGanadora] = useState<string | null>(null);

  const rotar = () => {
    setFormacion(prev => [prev[5], ...prev.slice(0, 5)]);
    setRotacion(r => (r + 1) % 6);
  };

  const cargarResultado = (resultado: "ganado" | "perdido") => {
    const punto: Punto = {
      rotacion,
      resultado,
      motivoGanado: resultado === "ganado" ? motivoGanado : undefined,
      motivoPerdido: resultado === "perdido" ? motivoPerdido : undefined,
      jugadoraGanadora: resultado === "ganado" ? jugadoraGanadora : null,
    };
    setPuntos(prev => [...prev, punto]);
  };

  return (
    <Container>
      <CanchaContainer>
        <h1>Rotación {rotacion + 1}</h1>
        <Grid>
          {formacion.map((jugadora, index) => (
            <JugadorCard key={index}>
              <strong>{jugadora.nombre}</strong>
              <span>{jugadora.posiciones.join("/")}</span>
            </JugadorCard>
          ))}
        </Grid>
      </CanchaContainer>

      <Panel>
        <h2>Controles</h2>
        <Boton onClick={rotar}>🔁 Rotar</Boton>

        <h3>Motivo de Punto Ganado</h3>
        <Select value={motivoGanado} onChange={(e) => setMotivoGanado(e.target.value)}>
          <option value="">Selecciona un motivo</option>
          {motivosGanados.map((motivo) => (
            <option key={motivo} value={motivo}>{motivo}</option>
          ))}
        </Select>

        <h3>Motivo de Punto Perdido</h3>
        <Select value={motivoPerdido} onChange={(e) => setMotivoPerdido(e.target.value)}>
          <option value="">Selecciona un motivo</option>
          {motivosPerdidos.map((motivo) => (
            <option key={motivo} value={motivo}>{motivo}</option>
          ))}
        </Select>

        <h3>Jugadora Ganadora (si aplica)</h3>
        <Select value={jugadoraGanadora || ""} onChange={(e) => setJugadoraGanadora(e.target.value)}>
          <option value="">Ninguna</option>
          {formacion.map((jugadora, index) => (
            <option key={index} value={jugadora.nombre}>{jugadora.nombre}</option>
          ))}
        </Select>

        <Boton color="green" onClick={() => cargarResultado("ganado")}>✔ Punto ganado</Boton>
        <Boton color="red" onClick={() => cargarResultado("perdido")}>❌ Punto perdido</Boton>

        <h3>Historial</h3>
        <Historial>
          {puntos.map((p, i) => (
            <li key={i}>
              R{p.rotacion + 1}: {p.resultado === "ganado" ? "✔ Ganado" : "❌ Perdido"} - 
              {p.resultado === "ganado" ? ` ${p.motivoGanado}` : ` ${p.motivoPerdido}`}
              {p.resultado === "ganado" && p.jugadoraGanadora ? ` - ${p.jugadoraGanadora}` : ""}
            </li>
          ))}
        </Historial>
      </Panel>
    </Container>
  );
}
