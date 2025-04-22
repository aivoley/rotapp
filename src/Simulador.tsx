import { useEffect, useState } from "react";
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
  background: #e0ffe0;
`;

const Zona = styled.div<{ area: string }>`
  grid-area: ${(props) => props.area};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #4caf50;
  border-radius: 10px;
  background: #ffffff;
  font-weight: bold;
  padding: 10px;
`;

const JugadoraCard = styled.div`
  background: #fafafa;
  border-radius: 6px;
  padding: 5px 10px;
  text-align: center;
  box-shadow: 0 0 5px rgba(0,0,0,0.15);
`;

const Panel = styled.div`
  flex: 1;
  padding: 20px;
  background: white;
  border-left: 2px solid #ccc;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
`;

const PlantillaSelector = styled.select`
  padding: 5px;
  font-size: 16px;
  margin-right: 10px;
`;

const PlantillaButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
`;

export default function Simulador() {
  const [formacion, setFormacion] = useState<typeof jugadorasBase>([]);
  const [suplentes, setSuplentes] = useState(jugadorasBase);
  const [plantillas, setPlantillas] = useState<Record<string, typeof jugadorasBase>>({});
  const [plantillaNombre, setPlantillaNombre] = useState("");
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState("");

  const zonas = [
    { area: "z1", nombre: "Zona 1" },
    { area: "z6", nombre: "Zona 6" },
    { area: "z5", nombre: "Zona 5" },
    { area: "z4", nombre: "Zona 4" },
    { area: "z3", nombre: "Zona 3" },
    { area: "z2", nombre: "Zona 2" },
  ];

  useEffect(() => {
    const guardadas = localStorage.getItem("plantillasFormacion");
    if (guardadas) {
      setPlantillas(JSON.parse(guardadas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("plantillasFormacion", JSON.stringify(plantillas));
  }, [plantillas]);

  const cargarJugadoras = () => {
    setSuplentes(jugadorasBase);
    setFormacion([]);
  };

  const agregarAJugar = (jugadora: typeof jugadorasBase[0]) => {
    if (formacion.length < 6 && !formacion.includes(jugadora)) {
      setFormacion([...formacion, jugadora]);
      setSuplentes(suplentes.filter(j => j !== jugadora));
    }
  };

  const sacarDeCancha = (index: number) => {
    const nuevaFormacion = [...formacion];
    const jugadora = nuevaFormacion.splice(index, 1)[0];
    setFormacion(nuevaFormacion);
    setSuplentes([...suplentes, jugadora]);
  };

  const guardarPlantilla = () => {
    if (formacion.length === 6 && plantillaNombre.trim()) {
      setPlantillas({ ...plantillas, [plantillaNombre]: formacion });
      setPlantillaNombre("");
    }
  };

  const cargarPlantilla = (nombre: string) => {
    const plantilla = plantillas[nombre];
    if (plantilla) {
      setFormacion(plantilla);
      const enCancha = new Set(plantilla.map(j => j.nombre));
      setSuplentes(jugadorasBase.filter(j => !enCancha.has(j.nombre)));
    }
  };

  const eliminarPlantilla = (nombre: string) => {
    const nuevas = { ...plantillas };
    delete nuevas[nombre];
    setPlantillas(nuevas);
    if (plantillaSeleccionada === nombre) {
      setPlantillaSeleccionada("");
    }
  };

  return (
    <Container>
      <Cancha>
        {zonas.map((zona, idx) => (
          <Zona key={zona.area} area={zona.area}>
            {formacion[idx] ? (
              <>
                <JugadoraCard>
                  <div>{formacion[idx].nombre}</div>
                  <small>{formacion[idx].posiciones.join("/")}</small>
                </JugadoraCard>
                <button onClick={() => sacarDeCancha(idx)}>❌</button>
              </>
            ) : (
              <span>Vacío</span>
            )}
          </Zona>
        ))}
      </Cancha>
      <Panel>
        <h2>📋 Formación Manual</h2>
        <button onClick={cargarJugadoras}>🔄 Cargar Jugadoras</button>
        <h3>Suplentes</h3>
        {suplentes.map(j => (
          <button key={j.nombre} onClick={() => agregarAJugar(j)}>
            ➕ {j.nombre} ({j.posiciones.join("/")})
          </button>
        ))}

        <h3>Guardar como Plantilla</h3>
        <input
          value={plantillaNombre}
          onChange={(e) => setPlantillaNombre(e.target.value)}
          placeholder="Nombre plantilla"
        />
        <button onClick={guardarPlantilla}>💾 Guardar</button>

        <h3>📂 Plantillas</h3>
        <div style={{ display: "flex", alignItems: "center" }}>
          <PlantillaSelector
            value={plantillaSeleccionada}
            onChange={(e) => {
              setPlantillaSeleccionada(e.target.value);
              cargarPlantilla(e.target.value);
            }}
          >
            <option value="">Seleccionar plantilla...</option>
            {Object.keys(plantillas).map(nombre => (
              <option key={nombre} value={nombre}>
                📁 {nombre}
              </option>
            ))}
          </PlantillaSelector>
          {plantillaSeleccionada && (
            <PlantillaButton onClick={() => eliminarPlantilla(plantillaSeleccionada)}>
              🗑 Eliminar
            </PlantillaButton>
          )}
        </div>
      </Panel>
    </Container>
  );
}



