import { useNavigate } from "react-router-dom";

export default function ComenzarPartidoButton({ formacion, banco }: { formacion: any[]; banco: any[] }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navega a la página de simulación pasando la formación y el banco
    navigate("/simulacion", { state: { formacion, banco } });
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "8px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        cursor: "pointer",
      }}
    >
      🚀 Comenzar Partido
    </button>
  );
}
