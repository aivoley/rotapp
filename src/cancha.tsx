import React, { useState } from "react";
import styled from "styled-components";

const jugadores = [
  { nombre: "Ana", posicion: "Armadora" },
  { nombre: "Belén", posicion: "Central" },
  { nombre: "Carla", posicion: "Central" },
  { nombre: "Delfina", posicion: "Punta" },
  { nombre: "Eva", posicion: "Punta" },
  { nombre: "Flor", posicion: "Opuesta" },
  { nombre: "Gaby", posicion: "Líbero" }
];

const Cancha = () => {
  const [formacion, setFormacion] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null
  });

  const [seleccionA, setSeleccionA] = useState<number | null>(null);

  const asignarJugadora = (zona: string, nombre: string) => {
    const seleccionada = jugadores.find(j => j.nombre === nombre);
    setFormacion(prev => ({ ...prev, [zona]: seleccionada }));
  };

  const intercambiar = (zona: number) => {
    if (seleccionA === null) {
      setSeleccionA(zona);
    } else {
      setFormacion(prev => {
        const nueva = { ...prev };
        [nueva[seleccionA], nueva[zona]] = [nueva[zona], nueva[seleccionA]];
        return nueva;
      });
      setSeleccionA(null);
    }
  };

  const reiniciarFormacion = () => {
    setFormacion({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
  };

  return (
    <Container>
      <Formacion>
        {Object.keys(formacion).map((zona) => (
          <Zona
            key={zona}
            onClick={() => intercambiar(Number(zona))}
            ocupado={formacion[zona]}
          >
            {formacion[zona] ? (
              <p>{formacion[zona]?.nombre} ({formacion[zona]?.posicion})</p>
            ) : (
              <span>Vacío</span>
            )}
          </Zona>
        ))}
      </Formacion>
      
      <Botones>
        <Button onClick={reiniciarFormacion}>Reiniciar formación</Button>
        
        <div>
          {Object.keys(formacion).map((zona) => (
            <select
              key={zona}
              onChange={(e) => asignarJugadora(zona, e.target.value)}
              value={formacion[zona]?.nombre || ""}
            >
              <option value="">Seleccionar jugadora</option>
              {jugadores.map((jugadora) => (
                <option key={jugadora.nombre} value={jugadora.nombre}>
                  {jugadora.nombre} ({jugadora.posicion})
                </option>
              ))}
            </select>
          ))}
        </div>
      </Botones>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const Formacion = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
`;

const Zona = styled.div<{ ocupado: any }>`
  width: 100px;
  height: 100px;
  border: 2px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${({ ocupado }) => (ocupado ? "#d1e7dd" : "#f8d7da")};
  color: ${({ ocupado }) => (ocupado ? "#0f5132" : "#721c24")};
`;

const Botones = styled.div`
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  margin: 5px;
  &:hover {
    background-color: #218838;
  }
`;

export default Cancha;
