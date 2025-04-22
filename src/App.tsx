import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SelectEquipo from "./SelectEquipo";
import Simulacion from "./Simulacion";

// Componente que representa el botón para comenzar el partido
import ComenzarPartidoButton from "./ComenzarPartidoButton";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <SelectEquipo />
          }
        />
        <Route path="/simulacion" element={<Simulacion />} />
      </Routes>
    </Router>
  );
}

export default App;
