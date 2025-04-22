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

const motivosGanados = [
  "ACE", "ATAQUE", "BLOQUEO", "TOQUE", "ERROR RIVAL"
];

const motivosPerdidos = [
  "ERROR DE SAQUE", "ERROR DE ATAQUE", "BLOQUEO RIVAL", "ERROR NO FORZADO", "ERROR DE RECEPCIÓN", "ATAQUE RIVAL", "SAQUE RIVAL"
];

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #f0fdf4;
`;

const Court = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
  width: 600px;
  height: 400px;
`;

const Zona = styled.div`
  background-color: #ffffff;
  border: 2px solid #10b981;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const JugadoraNombre = styled.strong`
  font-size: 16px;
`;

const JugadoraPosicion = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const Panel = styled.div`
  width: 320px;
  background-color: #ffffff;
  padding: 24px;
  border-left: 1px solid #ccc;
  box-shadow: -4px 0 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Button = styled.button<{ color?: string }>`
  width: 100%;
  padding: 10px;
  background-color: ${({ color }) => color || "#3b82f6"};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Label = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;
`;

export default function Simulador() {
  const [formacion, setFormacion] = useState(jugadorasBase.slice(0, 6));
  const [rotacion, setRotacion] = useState(0);
  const [puntos, setPuntos] = useState<any[]>([]);
  const [motivoGanado, setMotivoGanado] = useState("");
  const [motivoPerdido, setMotivoPerdido] = useState("");
  const [jugadoraGanadora, setJugadoraGanadora] = useState<string | null>(null);

  const rotar = () => {
    setFormacion(prev => [prev[5], ...prev.slice(0, 5)]);
    setRotacion(r => (r + 1) % 6);
  };

  const cargarResultado = (resultado: string) => {
    const punto = {
      rotacion,
      resultado,
      motivoGanado,
      motivoPerdido,
      jugadoraGanadora,
    };
    setPuntos(prev => [...prev, punto]);
    setMotivoGanado("");
    setMotivoPerdido("");
    setJugadoraGanadora(null);
  };

  return (
    <Container>
      <Court>
        <Title>Rotación {rotacion + 1}</Title>
        <Grid>
          {formacion.map((jugadora, index) => (
            <Zona key={index}>
              <JugadoraNombre>{jugadora.nombre}</JugadoraNombre>
              <JugadoraPosicion>{jugadora.posiciones.join(" / ")}</JugadoraPosicion>
            </Zona>
          ))}
        </Grid>
      </Court>
      <Panel>
        <h2>Controles</h2>
        <Button onClick={rotar}>🔁 Rotar</Button>

        <Label>Motivo de Punto Ganado</Label>
        <Select
          value={motivoGanado}
          onChange={(e) => setMotivoGanado(e.target.value)}
        >
          <option value="">Selecciona un motivo</option>
          {motivosGanados.map((motivo) => (
            <option key={motivo} value={motivo}>{motivo}</option>
          ))}
        </Select>

        <Label>Motivo de Punto Perdido</Label>
        <Select
          value={motivoPerdido}
          onChange={(e) => setMotivoPerdido(e.target.value)}
        >
          <option value="">Selecciona un motivo</option>
          {motivosPerdidos.map((motivo) => (
            <option key={motivo} value={motivo}>{motivo}</option>
          ))}
        </Select>

        <Label>Jugadora Destacada</Label>
        <Select
          value={jugadoraGanadora || ""}
          onChange={(e) => setJugadoraGanadora(e.target.value)}
        >
          <option value="">Ninguna</option>
          {formacion.map((jugadora, index) => (
            <option key={index} value={jugadora.nombre}>{jugadora.nombre}</option>
          ))}
        </Select>

        <Button color="#22c55e" onClick={() => cargarResultado("ganado")}>
          ✔ Punto Ganado
        </Button>
        <Button color="#ef4444" onClick={() => cargarResultado("perdido")}>
          ✖ Punto Perdido
        </Button>
      </Panel>
    </Container>
  );
}
