import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../../../../context/CurrentUserContext";
import trashIcon from "../../../../images/trash.png";
import inactiveLike from "../../../../images/inactiveLike.svg";
import activeLike from "../../../../images/activeLike.svg";
import saveIcon from "../../../../images/saveIcon.png";
import { PlaylistModal } from "../../../PlaylistModal/PlaylistModal";
import { VideoPreloader } from "../VideoPreloader/VideoPreloader";

export const Videos = ({
  videos = [],
  onDelete,
  onLiked,
  onCreateReview,
  loading,
  loadingVideoId,
}) => {
  const { currentUser } = useContext(CurrentUserContext);
  const [playlists, setPlaylists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoLoadingStates, setVideoLoadingStates] = useState({});
  const [showVideoPreloader, setShowVideoPreloader] = useState(false);
  const [currentLoadingVideo, setCurrentLoadingVideo] = useState(null);

  // Cargar playlists desde localStorage al montar
  useEffect(() => {
    const savedPlaylists =
      JSON.parse(localStorage.getItem("userPlaylists")) || [];
    setPlaylists(savedPlaylists);
  }, []);

  // Escuchar cambios de playlists (por si se actualizan desde otra parte)
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("userPlaylists")) || [];
      setPlaylists(updated);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const openModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const isVideoInPlaylists = (videoId) => {
    return playlists.some((playlist) =>
      playlist.videos.some((video) => video.videoId === videoId)
    );
  };

  const handleVideoClick = async (videoId, videoTitle) => {
    const videoData = videos.find((v) => v.video.videoId === videoId);

    setVideoLoadingStates((prev) => ({ ...prev, [videoId]: true }));
    setShowVideoPreloader(true);
    setCurrentLoadingVideo(videoData);

    // El VideoPreloader manejará el timing y completará automáticamente
  };

  const handlePreloaderComplete = () => {
    setShowVideoPreloader(false);

    if (currentLoadingVideo) {
      // Abrir YouTube en nueva pestaña
      window.open(
        `https://www.youtube.com/watch?v=${currentLoadingVideo.video.videoId}`,
        "_blank",
        "noopener,noreferrer"
      );

      // Limpiar estado de carga
      setVideoLoadingStates((prev) => ({
        ...prev,
        [currentLoadingVideo.video.videoId]: false,
      }));
    }

    setCurrentLoadingVideo(null);
  };

  return (
    <div className="videos__grid">
      {videos.length > 0 ? (
        videos.map((item) => {
          const alreadySaved = isVideoInPlaylists(item.video.videoId);
          const isVideoLoading =
            videoLoadingStates[item.video.videoId] ||
            loadingVideoId === item.video.videoId;

          return (
            <div
              key={item.video.videoId}
              className={`videos__grid-wrapper ${
                isVideoLoading ? "loading" : ""
              }`}
              style={{
                opacity: isVideoLoading ? 0.7 : 1,
                position: "relative",
              }}
            >
              {/* Overlay de carga */}
              {isVideoLoading && (
                <div className="video-loading-overlay">
                  <div className="video-spinner"></div>
                  <p>Cargando video...</p>
                </div>
              )}

              <div className="buttons">
                {/* ✅ Este botón abre el modal */}
                <button
                  className={`videos__save-button ${
                    currentUser ? "enabled" : "disabled"
                  } ${alreadySaved ? "saved" : ""}`}
                  onClick={() => openModal(item.video)}
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

              <div
                onClick={() =>
                  handleVideoClick(item.video.videoId, item.video.title)
                }
                style={{
                  cursor: isVideoLoading ? "not-allowed" : "pointer",
                  pointerEvents: isVideoLoading ? "none" : "auto",
                }}
              >
                <img
                  className="videos__thumbnail"
                  src={item.video.thumbnails[0].url}
                  alt={item.video.title}
                  style={{ filter: isVideoLoading ? "blur(1px)" : "none" }}
                />
              </div>

              <div className="videos__title">{item.video.title}</div>
              <div className="videos__channel-name">
                {item.video.channelName}
              </div>

              <div className="buttons-container">
                <button
                  className={`videos__channel-link ${
                    isVideoLoading ? "disabled" : ""
                  }`}
                  onClick={() =>
                    handleVideoClick(item.video.videoId, item.video.title)
                  }
                  style={{
                    pointerEvents: isVideoLoading ? "none" : "auto",
                    border: "none",
                    background: "none",
                    cursor: isVideoLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isVideoLoading ? "Cargando..." : "Ver video"}
                </button>

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
          );
        })
      ) : (
        <div style={{ color: "#888", fontSize: 15, margin: "16px 0" }}>
          No se encontraron resultados de YouTube.
        </div>
      )}

      {/* ✅ Modal sincronizado con el estado */}
      <PlaylistModal
        isOpen={isModalOpen}
        video={selectedVideo}
        onClose={closeModal}
        playlists={playlists}
        setPlaylists={setPlaylists}
      />

      {/* VideoPreloader para mostrar progreso de carga */}
      <VideoPreloader
        isVisible={showVideoPreloader}
        videoTitle={currentLoadingVideo?.video?.title || ""}
        onComplete={handlePreloaderComplete}
      />
    </div>
  );
};
