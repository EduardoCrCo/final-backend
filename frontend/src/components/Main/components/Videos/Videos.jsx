import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../../../../context/CurrentUserContext.js";
import trashIcon from "../../../../images/trash.png";
import inactiveLike from "../../../../images/inactiveLike.svg";
import activeLike from "../../../../images/activeLike.svg";
import saveIcon from "../../../../images/saveIcon.png";
import { PlaylistModal } from "../../../PlaylistModal/PlaylistModal.jsx";
import { VideoPreloader } from "../VideoPreloader/VideoPreloader.jsx";
import api from "../../../../utils/api.js";

export const Videos = ({
  videos = [],
  onDelete,
  onLiked,
  onCreateReview,
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

  const extractVideoId = (video) => {
    if (video.videoId) return video.videoId;
    if (video.youtubeId) return video.youtubeId;

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

        return matches;
      });
    });
  };

  const handleVideoClick = async (videoId) => {
    const videoData = videos.find((v) => v.video.videoId === videoId);

    setVideoLoadingStates((prev) => ({ ...prev, [videoId]: true }));
    setShowVideoPreloader(true);
    setCurrentLoadingVideo(videoData);
  };

  const handlePreloaderComplete = () => {
    setShowVideoPreloader(false);

    if (currentLoadingVideo) {
      window.open(
        `https://www.youtube.com/watch?v=${currentLoadingVideo.video.videoId}`,
        "_blank",
        "noopener,noreferrer"
      );

      setVideoLoadingStates((prev) => ({
        ...prev,
        [currentLoadingVideo.video.videoId]: false,
      }));
    }

    setCurrentLoadingVideo(null);
  };

  const loadUserPlaylists = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const savedUser = localStorage.getItem("currentUser");

      if (!token || !savedUser) {
        setPlaylists([]);
        setPlaylistsLoading(false);
        return;
      }

      setPlaylistsLoading(true);

      const playlists = await api.getUserPlaylists();
      "loadUserPlaylists: Respuesta recibida:", playlists;

      const playlistsArray = Array.isArray(playlists) ? playlists : [];
      "loadUserPlaylists: Array final:", playlistsArray;

      setPlaylists(playlistsArray);
    } catch (err) {
      console.error("Error cargando playlists:", err);
      setPlaylists([]);
    } finally {
      setPlaylistsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (currentUser !== undefined && currentUser && token) {
      "Condiciones cumplidas para cargar playlists:",
        {
          currentUser: !!currentUser,
          token: !!token,
        };
      loadUserPlaylists();
    } else if (currentUser !== undefined && (!currentUser || !token)) {
      setPlaylists([]);
      setPlaylistsLoading(false);
    }

    const handleUserLoggedIn = () => {
      const currentToken = localStorage.getItem("jwt");
      if (currentUser && currentToken) {
        loadUserPlaylists();
      }
    };

    window.addEventListener("user-logged-in", handleUserLoggedIn);
    return () =>
      window.removeEventListener("user-logged-in", handleUserLoggedIn);
  }, [currentUser]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const savedUser = localStorage.getItem("currentUser");

    if (token && savedUser && currentUser === undefined) {
      loadUserPlaylists();
    }
  }, [currentUser]);

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
              key={`${item.video.videoId}-${index}`}
              className={`videos__grid-wrapper ${
                isVideoLoading ? "loading" : ""
              }`}
              style={{
                opacity: isVideoLoading ? 0.7 : 1,
                position: "relative",
              }}
            >
              {isVideoLoading && (
                <div className="video-loading-overlay">
                  <div className="video-spinner"></div>
                  <p>Cargando video...</p>
                </div>
              )}

              <div className="buttons">
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
                  className={`videos__review-btn ${
                    !currentUser ? "videos__review-btn--disabled" : ""
                  }`}
                  onClick={() =>
                    currentUser && onCreateReview && onCreateReview(item.video)
                  }
                  disabled={!currentUser}
                  title={
                    !currentUser
                      ? "Inicia sesión para escribir reseñas"
                      : "Escribir una reseña de este video"
                  }
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

      <PlaylistModal
        isOpen={isModalOpen}
        video={selectedVideo}
        onClose={closeModal}
        playlists={playlists}
        playlistsLoading={playlistsLoading}
        loadUserPlaylists={loadUserPlaylists}
        currentUser={currentUser}
      />

      <VideoPreloader
        isVisible={showVideoPreloader}
        videoTitle={currentLoadingVideo?.video?.title || ""}
        onComplete={handlePreloaderComplete}
      />
    </div>
  );
};
