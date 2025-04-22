import { useState } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const zonasOrdenadas = [
  { id: 4, label: "Zona 4" },
  { id: 3, label: "Zona 3" },
  { id: 2, label: "Zona 2" },
  { id: 5, label: "Zona 5" },
  { id: 6, label: "Zona 6" },
  { id: 1, label: "Zona 1" },
];

const jugadorasBase = [
  { id: 1, nombre: "Candela", posiciones: ["Armadora"] },
  { id: 2, nombre: "Miranda", posiciones: ["Armadora"] },
  { id: 3, nombre: "Florencia", posiciones: ["Central", "Opuesta"] },
  { id: 4, nombre: "Abril M.", posiciones: ["Opuesta"] },
  { id: 5, nombre: "Micaela", posiciones: ["Punta"] },
  { id: 6, nombre: "Milena", posiciones: ["Punta"] },
  { id: 7, nombre: "Irina", posiciones: ["Punta", "Central"] },
  { id: 8, nombre: "Sol", posiciones: ["Punta"] },
  { id: 9, nombre: "Camila", posiciones: ["Central"] },
  { id: 10, nombre: "Josefina", posiciones: ["Central"] },
  { id: 11, nombre: "Abril S.", posiciones: ["Punta"] },
  { id: 12, nombre: "Julieta A", posiciones: ["Punta", "Líbero"] },
  { id: 13, nombre: "Julieta S", posiciones: ["Opuesta", "Líbero"] },
  { id: 14, nombre: "Carolina", posiciones: ["Punta", "Líbero"] },
  { id: 15, nombre: "Flavia", posiciones: ["Punta", "Líbero"] },
  { id: 16, nombre: "Agustina", posiciones: ["Punta"] },
];

const motivosGanado = ["ACE", "ATAQUE", "BLOQUEO", "TOQUE", "ERROR RIVAL"];
const motivosPerdido = [
  "ERROR DE SAQUE",
  "ERROR DE ATAQUE",
  "BLOQUEO RIVAL",
  "ERROR NO FORZADO",
  "ERROR DE RECEPCION",
  "ATAQUE RIVAL",
  "SAQUE RIVAL",
];

// Styled Components
const Layout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #dcfce7;
`;

const CanchaContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RotacionTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Cancha = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0.5rem;
  width: 600px;
  height: 400px;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Zona = styled.div<{ seleccionada: boolean }>`
  background: #fefce8;
  border-radius: 8px;
  padding: 0.5rem;
  border: ${(props) => (props.seleccionada ? "4px solid #3b82f6" : "1px solid #ccc")};
  cursor: pointer;
  text-align: center;
  &:hover {
    background: #fef9c3;
  }
`;

const BotonRotar = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  &:hover {
    background: #1d4ed8;
  }
`;

const PanelDerecho = styled.div`
  width: 380px;
  background: white;
  padding: 1rem;
  border-left: 1px solid #ccc;
  overflow-y: auto;
`;

const TituloPanel = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Boton = styled.button`
  background: #16a34a;
  color: white;
  padding: 0.5rem;
  width: 100%;
  margin-top: 0.5rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  &:hover {
    background: #15803d;
  }
`;

const BotonNuevoPartido = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  &:hover {
    background: #d97706;
  }
`;

export default function App() {
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
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const [setActual, setSetActual] = useState(1);

  const rotar = () => {
    const nueva = [...formacion];
    nueva.unshift(nueva.pop()!);
    setFormacion(nueva);
    setRotacion((r) => (r + 1) % 6);
  };

  const intercambiar = (index: number) => {
    if (seleccionada === null) {
      setSeleccionada(index);
    } else {
      const nueva = [...formacion];
      const temp = nueva[index];
      nueva[index] = nueva[seleccionada];
      nueva[seleccionada] = temp;
      setFormacion(nueva);
      setSeleccionada(null);
    }
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

  const estadisticas = puntos.reduce((acc, punto) => {
    const clave = `R${punto.rotacion + 1}`;
    acc[clave] = acc[clave] || { ganado: 0, perdido: 0 };
    acc[clave][punto.resultado]++;
    return acc;
  }, {} as Record<string, { ganado: number; perdido: number }>);

  const dataEstadisticas = Object.entries(estadisticas).map(([rot, val]) => ({
    rotacion: rot,
    ganado: val.ganado || 0,
    perdido: val.perdido || 0,
  }));

  const agregarJugadora = (jugadora: { nombre: string; posiciones: string[] }) => {
    setFormacion((prev) => [...prev, jugadora]);
  };

  const quitarJugadora = (index: number) => {
    setFormacion((prev) => prev.filter((_, i) => i !== index));
  };

  const nuevoPartido = () => {
    setFormacion(jugadorasBase.slice(0, 6));
    setRotacion(0);
    setPuntos([]);
    setHistorico([]);
    setSetActual(1);
  };

  const siguienteSet = () => {
    if (setActual < 5) setSetActual(setActual + 1);
  };

  const resultadosSets = Array.from({ length: 5 }, (_, i) => ({
    set: i + 1,
    resultado: "Ganado", // Aquí puedes añadir la lógica para los resultados
  }));

  return (
    <Layout>
      <CanchaContainer>
        <RotacionTitle>Rotación {rotacion + 1}</RotacionTitle>
        <Cancha>
          {zonasOrdenadas.map((zona, index) => {
            const jugadora = formacion.find((j) => j.id === zona.id);
            return (
              <Zona
                key={zona.id}
                seleccionada={seleccionada === index}
                onClick={() => intercambiar(index)}
              >
                <div style={{ fontSize: "10px", color: "#888" }}>{zona.label}</div>
                <div style={{ fontWeight: 600 }}>{jugadora?.nombre}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {jugadora?.posiciones.join(" / ")}
                </div>
              </Zona>
            );
          })}
        </Cancha>
        <BotonRotar onClick={rotar}>🔁 Rotar</BotonRotar>
        <BotonNuevoPartido onClick={nuevoPartido}>Nuevo Partido</BotonNuevoPartido>
        <button onClick={siguienteSet}>Siguiente Set</button>
      </CanchaContainer>

      <PanelDerecho>
        <TituloPanel>Estadísticas de la Rotación</TituloPanel>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dataEstadisticas}>
            <XAxis dataKey="rotacion" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ganado" fill="#16a34a" />
            <Bar dataKey="perdido" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            cargarResultado();
          }}
        >
          <Select
            value={tipoPunto}
            onChange={(e) => setTipoPunto(e.target.value)}
          >
            <option value="ganado">Punto Ganado</option>
            <option value="perdido">Punto Perdido</option>
          </Select>
          <Select
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          >
            <option value="">Motivo</option>
            {(tipoPunto === "ganado" ? motivosGanado : motivosPerdido).map(
              (motivo) => (
                <option key={motivo} value={motivo}>
                  {motivo}
                </option>
              )
            )}
          </Select>

          {tipoPunto === "ganado" && (
            <Select
              value={jugadoraPunto}
              onChange={(e) => setJugadoraPunto(e.target.value)}
            >
              <option value="">Seleccionar Jugadora</option>
              {formacion.map((jugadora) => (
                <option key={jugadora.id} value={jugadora.nombre}>
                  {jugadora.nombre}
                </option>
              ))}
            </Select>
          )}

          <Boton type="submit">Registrar Punto</Boton>
        </form>

        <div>
          <h3>Resultados de los Sets:</h3>
          <ul>
            {resultadosSets.map((result) => (
              <li key={result.set}>
                Set {result.set}: {result.resultado}
              </li>
            ))}
          </ul>
        </div>
      </PanelDerecho>
    </Layout>
  );
}

