import { useContext } from "react";
import { CurrentUserContext } from "../../../../context/CurrentUserContext";
import trashIcon from "../../../../images/trash.png";
import inactiveLike from "../../../../images/inactiveLike.svg";
import activeLike from "../../../../images/activeLike.svg";
import saveIcon from "../../../../images/saveIcon.png";

export const Videos = ({
  videos = [],
  onDelete,
  onLiked,
  onCreateReview,
  onAddToPlaylist,
}) => {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <div className="videos__grid">
      {videos.length > 0 ? (
        videos.map((item) => (
          <div key={item.video.videoId} className="videos__grid-wrapper">
            <div className="buttons">
              <button
                className="videos__save-button"
                onClick={() => onAddToPlaylist && onAddToPlaylist(item.video)}
              >
                <img
                  className="videos__save-icon"
                  src={saveIcon}
                  alt="Agregar a playlist"
                />
              </button>

              <button
                className={`videos__delete-btn ${
                  currentUser ? "enabled" : "disabled"
                }`}
                onClick={() => onDelete(item.video.videoId)}
                disabled={!currentUser}
              >
                <img
                  className="videos__trash-icon"
                  src={trashIcon}
                  alt="Eliminar"
                />
              </button>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${item.video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="videos__thumbnail"
                src={item.video.thumbnails[0].url}
                alt={item.video.title}
              />
            </a>
            <div className="videos__title">{item.video.title}</div>
            <div className="videos__channel-name">{item.video.channelName}</div>

            <div className="buttons-container">
              <a
                href={`https://www.youtube.com/watch?v=${item.video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="videos__channel-link"
              >
                Ver video
              </a>

              <button
                className="videos__review-btn"
                onClick={() => onCreateReview && onCreateReview(item.video)}
              >
                Escribir Review
              </button>

              <div className="videos__save-like-trash-container">
                <button
                  className={`videos__like-button ${
                    currentUser ? "enabled" : "disabled"
                  }`}
                  onClick={() => onLiked(item.video.videoId)}
                  disabled={!currentUser}
                >
                  <img
                    className={
                      item.liked
                        ? "videos__activeLike-icon"
                        : "videos__inactiveLike-icon"
                    }
                    src={item.liked ? activeLike : inactiveLike}
                    alt={item.liked ? "con me gusta" : "sin me gusta"}
                  />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ color: "#888", fontSize: 15, margin: "16px 0" }}>
          No se encontraron resultados de YouTube.
        </div>
      )}
    </div>
  );
};
