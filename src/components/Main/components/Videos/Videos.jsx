import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../../../../context/CurrentUserContext";
import trashIcon from "../../../../images/trash.png";
import inactiveLike from "../../../../images/inactiveLike.svg";
import activeLike from "../../../../images/activeLike.svg";
import saveIcon from "../../../../images/saveIcon.png";
import { PlaylistModal } from "../../../PlaylistModal/PlaylistModal";
import { VideoPreloader } from "../VideoPreloader/VideoPreloader";
//import { set } from "mongoose";

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
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoLoadingStates, setVideoLoadingStates] = useState({});
  const [showVideoPreloader, setShowVideoPreloader] = useState(false);
  const [currentLoadingVideo, setCurrentLoadingVideo] = useState(null);

  const openModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // Helper function para extraer videoId de thumbnails (igual que en backend)
  const extractVideoId = (video) => {
    if (video.videoId) return video.videoId;
    if (video.youtubeId) return video.youtubeId;

    // Extraer de thumbnails si no tiene videoId directo
    if (video.thumbnails && video.thumbnails.length > 0) {
      const thumbnailUrl = video.thumbnails[0].url;
      const match = thumbnailUrl.match(/\/vi\/([^/]+)\//);
      return match ? match[1] : null;
    }

    return null;
  };

  const isVideoInPlaylists = (youtubeId) => {
    if (!Array.isArray(playlists)) return false;

    return playlists.some((playlist) => {
      if (!Array.isArray(playlist.videos)) return false;

      return playlist.videos.some((video) => {
        const playlistVideoId = extractVideoId(video);
        const matches = playlistVideoId === youtubeId;

        if (matches) {
          console.log(`✅ Video ${youtubeId} encontrado en playlist!`);
        }

        return matches;
      });
    });
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

  const loadUserPlaylists = async () => {
    try {
      // Verificar si hay usuario y token
      const token = currentUser?.token || localStorage.getItem("jwt");
      if (!currentUser || !token) {
        console.log("No user or token, clearing playlists");
        setPlaylists([]);
        setPlaylistsLoading(false);
        return;
      }

      setPlaylistsLoading(true);
      const response = await fetch("http://localhost:8080/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          "Error response:",
          response.status,
          await response.text()
        );
        setPlaylists([]);
        return;
      }

      const data = await response.json();
      setPlaylists(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando playlists:", err);
      setPlaylists([]);
    } finally {
      setPlaylistsLoading(false);
    }
  };

  // ⚡ Cargar playlists cuando cambie el usuario y tenga token (consolidado)
  useEffect(() => {
    // Solo cargar si currentUser está completamente cargado y tiene token
    if (currentUser !== undefined) {
      loadUserPlaylists();
    }
  }, [currentUser?.token, currentUser?.name]); // Dependencia más específica

  // ⚡ Escuchar eventos de login para recargar playlists
  useEffect(() => {
    const handleUserLoggedIn = () => {
      // console.log("User logged in event received, reloading playlists");
      if (currentUser?.token) {
        loadUserPlaylists();
      }
    };

    window.addEventListener("user-logged-in", handleUserLoggedIn);
    return () =>
      window.removeEventListener("user-logged-in", handleUserLoggedIn);
  }, [currentUser?.token]);

  //Crear lista sin duplicados
  const uniqueVideos = Array.from(
    new Map(videos.map((v) => [v.video.videoId, v])).values()
  );

  return (
    <div className="videos__grid">
      {uniqueVideos.length > 0 ? (
        uniqueVideos.map((item, index) => {
          const alreadySaved = isVideoInPlaylists(item.video.videoId);

          const isVideoLoading =
            videoLoadingStates[item.video.videoId] ||
            loadingVideoId === item.video.videoId;

          return (
            <div
              // key={item.video.videoId}
              key={`${item.video.videoId}-${index}`}
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
                  onClick={() =>
                    currentUser &&
                    openModal({
                      ...item.video,
                      videoId: item.video.videoId || item.id,
                    })
                  }
                  disabled={!currentUser}
                  title={
                    currentUser
                      ? alreadySaved
                        ? "Video ya guardado"
                        : "Agregar a playlist"
                      : "Inicia sesión para guardar videos"
                  }
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
        <div className="video__grid-empty">Aun no hay resultados cargados.</div>
      )}

      {/* ✅ Modal sincronizado con el estado */}
      <PlaylistModal
        isOpen={isModalOpen}
        video={selectedVideo}
        onClose={closeModal}
        playlists={playlists}
        playlistsLoading={playlistsLoading}
        loadUserPlaylists={loadUserPlaylists}
        currentUser={currentUser}
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
