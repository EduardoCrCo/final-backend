import { useContext } from "react";
import { CurrentUserContext } from "../../../../context/CurrentUserContext";

export const Videos = ({ videos = [], onDelete }) => {
  const user = useContext(CurrentUserContext);

  return (
    <div className="videos__grid">
      {(videos || []).map((video) => (
        <div className="videos__grid-wrapper" key={video.id}>
          <iframe
            src={video.url}
            title={video.title}
            className="videos__iframe"
            width="100%"
            height="100%"
            allowFullScreen
          />
          <h3 className="videos__title">{video.title}</h3>
          <button
            className={`videos__delete-btn ${user ? "enabled" : "disabled"}`}
            onClick={() => onDelete(video.id)}
            disabled={!user}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
};
