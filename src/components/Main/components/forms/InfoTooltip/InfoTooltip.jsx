import { Popup } from "../../Popup/Popup";
import "../../../../../blocks/InfoTooltip.css";
import "../../../../../blocks/popup.css";

export const InfoTooltip = ({ message, onClose }) => {
  // Separar el mensaje en dos renglones si contiene el separador especial
  let lines = typeof message === "string" ? message.split("|n|") : [message];
  return (
    <Popup onClose={onClose} customClassName="info-tooltip__popup">
      <div className="info-tooltip__container">
        <div className="info-tooltip__icon">
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
        <p className="info-tooltip__message">
          {lines.map((line, idx) => (
            <span key={idx} className="info-tooltip__line">
              {line}
            </span>
          ))}
        </p>
        <button className="info-tooltip__close-button" onClick={onClose}>
          OK
        </button>
      </div>
    </Popup>
  );
};
