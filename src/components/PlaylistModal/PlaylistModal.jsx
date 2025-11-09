import { useState, useEffect } from "react";

export const PlaylistModal = ({ isOpen, video, onClose, onAddToPlaylist }) => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Cargar playlists existentes desde localStorage
      const savedPlaylists =
        JSON.parse(localStorage.getItem("userPlaylists")) || [];
      setPlaylists(savedPlaylists);
    }
  }, [isOpen]);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = {
        id: Date.now(),
        name: newPlaylistName,
        videos: [],
        createdAt: new Date().toISOString(),
      };
      const updatedPlaylists = [...playlists, newPlaylist];
      setPlaylists(updatedPlaylists);
      localStorage.setItem("userPlaylists", JSON.stringify(updatedPlaylists));
      setNewPlaylistName("");
      setIsCreatingNew(false);
    }
  };

  const handleAddToExistingPlaylist = (playlistId) => {
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        // Verificar si el video ya está en la playlist
        const videoExists = playlist.videos.some(
          (v) => v.videoId === video.videoId
        );
        if (!videoExists) {
          return { ...playlist, videos: [...playlist.videos, video] };
        }
      }
      return playlist;
    });
    setPlaylists(updatedPlaylists);
    localStorage.setItem("userPlaylists", JSON.stringify(updatedPlaylists));
    onAddToPlaylist(playlistId, video);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Agregar a Playlist</h3>
        <p className="text-sm text-gray-600 mb-4">"{video?.title}"</p>

        {/* Lista de playlists existentes */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Playlists existentes:</h4>
          {playlists.length > 0 ? (
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToExistingPlaylist(playlist.id)}
                  className="w-full text-left p-2 border rounded hover:bg-gray-50"
                >
                  <div className="font-medium">{playlist.name}</div>
                  <div className="text-sm text-gray-500">
                    {playlist.videos.length} videos
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No tienes playlists aún</p>
          )}
        </div>

        {/* Crear nueva playlist */}
        <div className="border-t pt-4">
          {!isCreatingNew ? (
            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-gray-400"
            >
              + Crear nueva playlist
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Nombre de la playlist"
                className="w-full p-2 border rounded"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreatePlaylist}
                  className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Crear
                </button>
                <button
                  onClick={() => {
                    setIsCreatingNew(false);
                    setNewPlaylistName("");
                  }}
                  className="flex-1 bg-gray-300 p-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="w-full mt-4 p-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
