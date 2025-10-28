import { Popup } from "../../Popup/Popup";

export const InfoTooltip = ({ message, onClose }) => {
  // Separar el mensaje en dos renglones si contiene el separador especial
  let lines = typeof message === "string" ? message.split("|n|") : [message];
  return (
    <Popup onClose={onClose} customClassName="info-tooltip__popup">
      <div className="info-tooltip__container">
        <div style={{ fontSize: 48, color: "#4caf50", marginBottom: 12 }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="24" fill="#e8f5e9" />
            <path
              d="M34 18L22 30L14 22"
              stroke="#4caf50"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p
          className="info-tooltip__message"
          style={{
            fontWeight: 600,
            fontSize: "1.2rem",
            color: "#222",
            marginBottom: 18,
          }}
        >
          {lines.map((line, idx) => (
            <span key={idx} style={{ display: "block" }}>
              {line}
            </span>
          ))}
        </p>
        <button
          className="info-tooltip__close"
          style={{
            fontSize: "1.1rem",
            padding: "10px 32px",
            background: "#4caf50",
            color: "#fff",
            borderRadius: 8,
            border: "none",
            marginTop: 8,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(76,175,80,0.12)",
          }}
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </Popup>
  );
};
