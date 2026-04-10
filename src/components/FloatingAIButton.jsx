import { useNavigate } from "react-router-dom";
import "@/utils/FloatingAIButton.css";

export default function FloatingAIButton() {
  const navigate = useNavigate();

  return (
    <div className="fab-container" onClick={() => navigate("/chat-with-ai")}>
      <span className="fab-tooltip">Chat with AI</span>
      🤖
    </div>
  );
}