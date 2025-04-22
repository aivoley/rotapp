import { BrowserRouter, Routes, Route } from "react-router-dom";
import SeleccionFormacion from "./SeleccionFormacion";
import Simulacion from "./Simulacion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SeleccionFormacion />} />
        <Route path="/simulacion" element={<Simulacion />} />
      </Routes>
    </BrowserRouter>
  );
}
