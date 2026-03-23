// FloatingAIButton.jsx
import { useNavigate } from "react-router-dom";

export default function FloatingAIButton() {
  const navigate = useNavigate();

  return (
    <div style={styles.container} onClick={() => navigate("/chat-with-ai")}>
      🤖
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#007bff",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
};