import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import api from "../../utils/api";

export const PlaylistModal = ({
  isOpen,
  video,
  onClose,
  playlists,
  playlistsLoading,
  loadUserPlaylists,
}) => {
  const { currentUser } = useContext(CurrentUserContext);

  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // ➤ Crear playlist usando api.js con mejor sincronización
  const handleCreatePlaylist = async (e) => {
    if (e) e.preventDefault(); // Evitar refresh de página
    if (!newPlaylistName.trim() || isLoading) return; // Prevenir múltiples clicks

    if (!currentUser) {
      toast.error("Debes iniciar sesión para crear playlists");
      return;
    }

    const trimmedName = newPlaylistName.trim();

    setIsLoading(true);
    console.log("🚀 Iniciando creación de playlist:", trimmedName);

    try {
      const newPlaylist = await api.createPlaylist(trimmedName);
      console.log("✅ Playlist creada:", newPlaylist);

      toast.success("Playlist creada correctamente");
      setNewPlaylistName("");
      setIsCreatingNew(false);

      // Recargar playlists desde el backend
      if (loadUserPlaylists) {
        console.log("🔄 Recargando playlists...");
        await loadUserPlaylists();
        console.log("✅ Playlists recargadas");
      }
    } catch (error) {
      console.error("❌ Error creando playlist:", error);
      // Mostrar mensaje específico del backend para duplicados
      if (error.message === "Ya existe una playlist con ese nombre") {
        toast.warning(error.message);
      } else {
        toast.error(error.message || "Error al crear playlist");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ➤ Agregar video a playlist usando api.js con loading state
  const handleAddToExistingPlaylist = async (playlistId, e) => {
    if (e) e.preventDefault(); // Evitar refresh
    if (isLoading) return; // Prevenir múltiples clicks

    setIsLoading(true);
    try {
      await api.addVideoToPlaylist(playlistId, video);
      toast.success("Video agregado");

      // Recargar playlists y cerrar modal
      if (loadUserPlaylists) {
        await loadUserPlaylists();
      }
      onClose();
    } catch (err) {
      console.error("Error agregando video:", err);
      toast.error(err.message || "No se pudo agregar el video");
    } finally {
      setIsLoading(false);
    }
  };

  // ➤ Eliminar video de playlist usando api.js
  const handleDeleteVideo = async (playlistId, videoId) => {
    try {
      await api.removeVideoFromPlaylist(playlistId, videoId);
      toast.info("Video eliminado");
      if (loadUserPlaylists) await loadUserPlaylists();
    } catch (err) {
      console.error("Error eliminando video:", err);
      toast.error("No se pudo eliminar el video");
    }
  };

  // ➤ Eliminar playlist usando api.js
  const handleDeletePlaylist = async (playlistId) => {
    try {
      await api.deletePlaylist(playlistId);
      toast.error("Playlist eliminada");
      if (loadUserPlaylists) await loadUserPlaylists();
    } catch (err) {
      console.error("Error eliminando playlist:", err);
      toast.error("No se pudo borrar la playlist");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("popup__overlay")) onClose();
  };

  return (
    <div className="popup popup_opened">
      <div className="popup__overlay" onClick={handleOverlayClick}></div>
      <div className="popup__content">
        <div className="popup__body playlist-modal__body">
          <button className="popup__close-button" onClick={onClose}>
            X
          </button>

          <div className="playlist-modal__content">
            <h3 className="playlist-modal__title">Playlists</h3>
            <p className="playlist-modal__video-title">
              {video ? `"${video.title}"` : "Administrar playlists"}
            </p>

            {/* Sección de playlists */}
            <div className="playlist-modal__section">
              <h4 className="playlist-modal__section-title">Tus playlists:</h4>

              {playlistsLoading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <div className="playlist-loading-spinner"></div>
                  <p>Cargando playlists...</p>
                </div>
              ) : playlists.length > 0 ? (
                <div className="playlist-modal__playlist-list">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist._id}
                      className="playlist-modal__playlist-item"
                    >
                      <div className="playlist-modal__playlist-header">
                        <div>
                          <strong>{playlist.name}</strong>{" "}
                          <span>({playlist.videos.length} videos)</span>
                        </div>

                        <div className="playlist-modal__actions">
                          <button
                            onClick={(e) =>
                              handleAddToExistingPlaylist(playlist._id, e)
                            }
                            disabled={isLoading}
                            className="playlist-modal__btn playlist-modal__btn--add"
                          >
                            {isLoading ? "⏳" : "➕"}
                          </button>
                          <button
                            onClick={() =>
                              setExpandedPlaylistId(
                                expandedPlaylistId === playlist._id
                                  ? null
                                  : playlist._id
                              )
                            }
                            className="playlist-modal__btn playlist-modal__btn--toggle"
                          >
                            {expandedPlaylistId === playlist._id ? "🔽" : "▶"}
                          </button>
                          <button
                            onClick={() => handleDeletePlaylist(playlist._id)}
                            className="playlist-modal__btn playlist-modal__btn--delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {expandedPlaylistId === playlist._id && (
                        <ul className="playlist-modal__video-list">
                          {playlist.videos.length > 0 ? (
                            playlist.videos.map((v, index) => (
                              <li
                                key={`${playlist._id}-${
                                  v.videoId || v.video?.videoId || index
                                }`}
                                className="playlist-modal__video-item"
                              >
                                <span>{v.title}</span>
                                <button
                                  onClick={() => {
                                    const videoId =
                                      v.videoId ||
                                      (v.thumbnails &&
                                        v.thumbnails[0] &&
                                        v.thumbnails[0].url.match(
                                          /\/vi\/([^/]+)\//
                                        )?.[1]);
                                    handleDeleteVideo(playlist._id, videoId);
                                  }}
                                  className="playlist-modal__btn playlist-modal__btn--small"
                                >
                                  ❌
                                </button>
                              </li>
                            ))
                          ) : (
                            <li
                              key={`empty-${playlist._id}`}
                              className="playlist-modal__empty"
                            >
                              Sin videos aún
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="playlist-modal__empty-message">
                  No tienes playlists aún
                </p>
              )}
            </div>

            {/* Crear nueva playlist */}
            <div className="playlist-modal__create-section">
              {!isCreatingNew ? (
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="playlist-modal__create-button"
                >
                  + Crear nueva playlist
                </button>
              ) : (
                <div className="playlist-modal__create-form">
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Nombre de la playlist"
                    className="playlist-modal__input"
                    autoFocus
                  />
                  <div className="playlist-modal__button-group">
                    <button
                      onClick={handleCreatePlaylist}
                      disabled={isLoading}
                      className="playlist-modal__button playlist-modal__button--primary"
                    >
                      {isLoading ? "Creando..." : "Crear"}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingNew(false);
                        setNewPlaylistName("");
                      }}
                      className="playlist-modal__button playlist-modal__button--secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
