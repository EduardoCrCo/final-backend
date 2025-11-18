import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const PlaylistModal = ({
  isOpen,
  video,
  onClose,
  playlists,
  setPlaylists,
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);

  // ⚡ Ya no cargamos playlists desde localStorage aquí (vienen por props)

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = {
        id: Date.now(),
        name: newPlaylistName.trim(),
        videos: [],
        createdAt: new Date().toISOString(),
      };
      const updatedPlaylists = [...playlists, newPlaylist];
      setPlaylists(updatedPlaylists);
      localStorage.setItem("userPlaylists", JSON.stringify(updatedPlaylists));
      toast.success("Playlist creada correctamente");
      setNewPlaylistName("");
      setIsCreatingNew(false);
    }
  };

  // Cerrar al hacer clic fuera
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("popup__overlay")) onClose();
  };

  const handleAddToExistingPlaylist = (playlistId) => {
    if (!video || !video.videoId) {
      toast.error("El video no es válido.");
      return;
    }

    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        const exists = playlist.videos.some((v) => v.videoId === video.videoId);
        if (exists) {
          toast.warning("El video ya está en esta playlist.");
          return playlist;
        }
        toast.success("Video agregado correctamente.");
        return { ...playlist, videos: [...playlist.videos, video] };
      }
      return playlist;
    });

    setPlaylists(updatedPlaylists);
    localStorage.setItem("userPlaylists", JSON.stringify(updatedPlaylists));
    onClose();
  };

  const handleDeleteVideo = (playlistId, videoId) => {
    const updatedPlaylists = playlists.map((playlist) =>
      playlist.id === playlistId
        ? {
            ...playlist,
            videos: playlist.videos.filter((v) => v.videoId !== videoId),
          }
        : playlist
    );
    setPlaylists(updatedPlaylists);
    localStorage.setItem("userPlaylists", JSON.stringify(updatedPlaylists));
    toast.info("Video eliminado de la playlist.");
  };

  const handleDeletePlaylist = (playlistId) => {
    const updated = playlists.filter((p) => p.id !== playlistId);
    setPlaylists(updated);
    localStorage.setItem("userPlaylists", JSON.stringify(updated));
    toast.error("Playlist eliminada.");
  };

  if (!isOpen) return null;

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

              {playlists.length > 0 ? (
                <div className="playlist-modal__playlist-list">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="playlist-modal__playlist-item"
                    >
                      <div className="playlist-modal__playlist-header">
                        <div>
                          <strong>{playlist.name}</strong>{" "}
                          <span>({playlist.videos.length} videos)</span>
                        </div>

                        <div className="playlist-modal__actions">
                          <button
                            onClick={() =>
                              handleAddToExistingPlaylist(playlist.id)
                            }
                            className="playlist-modal__btn playlist-modal__btn--add"
                          >
                            ➕
                          </button>
                          <button
                            onClick={() =>
                              setExpandedPlaylistId(
                                expandedPlaylistId === playlist.id
                                  ? null
                                  : playlist.id
                              )
                            }
                            className="playlist-modal__btn playlist-modal__btn--toggle"
                          >
                            {expandedPlaylistId === playlist.id ? "🔽" : "▶"}
                          </button>
                          <button
                            onClick={() => handleDeletePlaylist(playlist.id)}
                            className="playlist-modal__btn playlist-modal__btn--delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {expandedPlaylistId === playlist.id && (
                        <ul className="playlist-modal__video-list">
                          {playlist.videos.length > 0 ? (
                            playlist.videos.map((v) => (
                              <li
                                key={v.videoId}
                                className="playlist-modal__video-item"
                              >
                                <span>{v.title}</span>
                                <button
                                  onClick={() =>
                                    handleDeleteVideo(playlist.id, v.videoId)
                                  }
                                  className="playlist-modal__btn playlist-modal__btn--small"
                                >
                                  ❌
                                </button>
                              </li>
                            ))
                          ) : (
                            <li className="playlist-modal__empty">
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
                      className="playlist-modal__button playlist-modal__button--primary"
                    >
                      Crear
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
