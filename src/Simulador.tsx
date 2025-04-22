import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
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
  background: #e8f5e9;
`;

const Zona = styled.div<{ area: string }>`
  grid-area: ${(props) => props.area};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid green;
  border-radius: 8px;
  background: #fafff5;
`;

const JugadoraCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 8px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 0 8px rgba(0, 128, 0, 0.1);
`;

const Panel = styled.div`
  flex: 1;
  padding: 20px;
  background: #fff;
  border-left: 2px solid #ccc;
  display: flex;
  flex-direction: column;
`;

const Dropdown = styled.select`
  padding: 6px;
  border-radius: 6px;
  margin-top: 5px;
`;

export default function Simulacion() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const formacion = state?.formacion || [];
  const banco = state?.banco || [];

  const zonas = [
    { area: "z1", nombre: "Zona 1" },
    { area: "z6", nombre: "Zona 6" },
    { area: "z5", nombre: "Zona 5" },
    { area: "z4", nombre: "Zona 4" },
    { area: "z3", nombre: "Zona 3" },
    { area: "z2", nombre: "Zona 2" },
  ];

  const handleCambio = (index: number, nueva: string) => {
    const nuevaFormacion = [...formacion];
    const jugadora = banco.find(j => j.nombre === nueva);
    if (jugadora) {
      [nuevaFormacion[index], banco[banco.indexOf(jugadora)]] = [jugadora, nuevaFormacion[index]];
      navigate(".", { replace: true, state: { formacion: nuevaFormacion, banco: banco } });
    }
  };

  return (
    <Container>
      <Cancha>
        {zonas.map((zona, i) => (
          <Zona key={zona.area} area={zona.area}>
            <div>
              <JugadoraCard>{formacion[i]?.nombre}</JugadoraCard>
              <Dropdown onChange={(e) => handleCambio(i, e.target.value)} value="">
                <option value="">Cambiar</option>
                {banco.map((j) => (
                  <option key={j.nombre} value={j.nombre}>
                    {j.nombre} ({j.posiciones.join("/")})
                  </option>
                ))}
              </Dropdown>
            </div>
          </Zona>
        ))}
      </Cancha>
      <Panel>
        <h2>Simulación del Set</h2>
        <p>Visualizá la rotación y cambiá jugadoras desde acá.</p>
        <button onClick={() => navigate("/")}>🔙 Volver</button>
      </Panel>
    </Container>
  );
}


