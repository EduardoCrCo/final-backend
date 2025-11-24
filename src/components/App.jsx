import { useState, useEffect } from "react";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { Main } from "./Main/Main";
import { searchYouTube } from "../utils/ThirdPartyApi";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Dashboard } from "./Dashboard/Dashboard";
import { Reviews } from "./Reviews/Reviews";
import { AboutMe } from "./AboutMe/AboutMe";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { Popup } from "../components/Main/components/Popup/Popup";
import { InfoTooltip } from "../components/Main/components/forms/InfoTooltip/InfoTooltip";
import { LoginForm } from "./Main/components/forms/LoginForm/LoginForm";
import { PlaylistModal } from "./PlaylistModal/PlaylistModal";
import * as auth from "../utils/auth";
import api from "../utils/api";
import { useSecureAuth } from "../hooks/useSecureAuth";
import { migrateAuthData, validateCleanUserData } from "../utils/authMigration";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { set } from "mongoose";

export const App = () => {
  const navigate = useNavigate();

  // Estado y lógica de negocio para videos y búsqueda YouTube
  const [youtubeInfo, setYoutubeInfo] = useState(null);
  const [youtubeQuery, setYoutubeQuery] = useState("");
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState(() => {
    const saved = localStorage.getItem("selectedVideos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setYoutubeResults([]);
    if (!youtubeQuery.trim() || youtubeQuery.length < 2) return;

    searchYouTube(youtubeQuery, 12)
      .then((results) => {
        // El backend ya devuelve el formato correcto, solo usamos directamente
        setYoutubeResults(results || []);
      })
      .catch((error) => {
        console.error("❌ App.jsx: Search error:", error);
        setYoutubeResults([]);
      });
  }, [youtubeQuery]);

  useEffect(() => {
    localStorage.setItem("selectedVideos", JSON.stringify(selectedVideos));
  }, [selectedVideos]);

  const handleDeleteVideo = async (id) => {
    console.log("🗑️ Frontend: Deleting video:", id);

    try {
      // Intentar eliminar del backend primero
      const result = await api.deleteVideo(id);
      console.log("✅ Frontend: Video deleted from backend:", result);

      // Eliminar del estado local
      setSelectedVideos(selectedVideos.filter((v) => v.video.videoId !== id));

      console.log(`✅ Frontend: Video ${id} eliminated from grid and database`);

      // Mostrar información de limpieza adicional si aplica
      if (result.deletedReviews > 0 || result.updatedPlaylists > 0) {
        console.log(
          `📊 Frontend: Also cleaned ${result.deletedReviews} reviews and ${result.updatedPlaylists} playlists`
        );
      }
    } catch (error) {
      console.error("❌ Frontend: Error deleting from backend:", error.message);

      // Si el video no existe en el backend (video no guardado), eliminarlo solo del estado local
      if (
        error.message.includes("Video no encontrado") ||
        error.message.includes("not found")
      ) {
        console.log(
          "📝 Frontend: Video not in database, removing only from local state"
        );

        // Eliminar del estado local (video de búsqueda no guardado)
        setSelectedVideos(selectedVideos.filter((v) => v.video.videoId !== id));

        console.log(
          `✅ Frontend: Video ${id} eliminated from grid (was not in database)`
        );
      } else {
        // Solo mostrar error para errores reales (permisos, servidor, etc.)
        console.error("❌ Frontend: Real error deleting video:", error.message);
        alert(`Error al eliminar el video: ${error.message}`);
      }
    }
  };

  const handleLikeVideo = async (videoId) => {
    console.log("💖 Frontend: Toggling like for video:", videoId);

    // Buscar el video en selectedVideos
    const video = selectedVideos.find((v) => v.video.videoId === videoId);
    if (!video) {
      console.error("❌ Video not found in selectedVideos");
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("Debes estar logueado para dar like", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      // Primero buscar el video en BD por youtubeId usando API centralizada
      console.log(
        "🔍 Frontend: Finding video in database by youtubeId:",
        videoId
      );

      let dbVideo;

      try {
        const response = await api.findVideoByYoutubeId(videoId);
        dbVideo = response.video;
        console.log("📁 Frontend: Video found in DB:", dbVideo._id);
      } catch (findError) {
        // Si no existe, guardarlo primero usando API centralizada
        console.log("💾 Frontend: Video not in DB, saving first...");

        const saveResult = await api.addVideo(video.video);
        dbVideo = saveResult.video;
        console.log("✅ Frontend: Video saved to DB:", dbVideo._id);
      }

      // Ahora hacer like usando el _id de MongoDB con API centralizada
      const updatedVideo = await api.likeVideo(dbVideo._id);
      console.log("✅ Frontend: Like saved to backend:", updatedVideo);

      // Actualizar el estado local
      setSelectedVideos(
        selectedVideos.map((v) =>
          v.video.videoId === videoId ? { ...v, liked: !v.liked } : v
        )
      );

      toast.success(
        video.liked ? "Like removido" : "¡Video marcado como favorito!",
        {
          position: "bottom-center",
          autoClose: 1500,
        }
      );
    } catch (error) {
      console.error("❌ Frontend: Error handling like:", error);
      toast.error("Error al procesar el like", {
        position: "bottom-center",
        autoClose: 2000,
      });
    }
  };

  const handleCreateReview = (video) => {
    // Guardar el video seleccionado en localStorage para usarlo en Reviews
    localStorage.setItem("selectedVideoForReview", JSON.stringify(video));
    // Navegar a la página de Reviews
    navigate("/reviews");
  };

  // Estado para el modal de playlists
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedVideoForPlaylist, setSelectedVideoForPlaylist] =
    useState(null);

  const handleAddToPlaylist = (video) => {
    setSelectedVideoForPlaylist(video);
    setShowPlaylistModal(true);
  };

  const handlePlaylistModalClose = () => {
    setShowPlaylistModal(false);
    setSelectedVideoForPlaylist(null);
  };

  const handleVideoAddedToPlaylist = (playlistId, video) => {
    console.log(`Video "${video.title}" agregado a playlist ${playlistId}`);
    // Aquí podrías mostrar una notificación de éxito
  };

  const [popupType, setPopupType] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    // 🔄 Migrar datos existentes para seguridad
    migrateAuthData();

    // Try to get user info from API (if token is valid)
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem("currentUser");
        const token = localStorage.getItem("jwt");

        if (token) {
          // Si hay token, intentar obtener info del backend
          try {
            const user = await api.getUserInfo();
            // ✅ Usuario limpio SIN token (más seguro)
            const cleanUser = {
              _id: user._id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              about: user.about || "",
            };
            setCurrentUser(cleanUser);
            localStorage.setItem("currentUser", JSON.stringify(cleanUser));
          } catch (apiError) {
            console.error("API error:", apiError);
            // Si falla API pero hay usuario guardado, usarlo
            if (savedUser) {
              try {
                const parsedUser = JSON.parse(savedUser);
                // Limpiar token si existe en usuario guardado
                const { token: _, ...cleanSavedUser } = parsedUser;
                setCurrentUser(cleanSavedUser);
              } catch (parseErr) {
                console.error("Error parsing saved user:", parseErr);
                setCurrentUser(null);
              }
            } else {
              setCurrentUser(null);
            }
          }
        } else if (savedUser) {
          // Sin token pero con usuario guardado
          try {
            const parsedUser = JSON.parse(savedUser);
            // Limpiar token si existe en usuario guardado
            const { token: _, ...cleanSavedUser } = parsedUser;
            setCurrentUser(cleanSavedUser);
          } catch (parseErr) {
            console.error("Error parsing saved user:", parseErr);
            setCurrentUser(null);
          }
        } else {
          // Sin token ni usuario
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setCurrentUser(null);
      }
    };

    loadUser();
  }, []);

  const handleRegistration = (name, email, password) => {
    auth
      .register({ name, email, password })
      .then(() => {
        setCurrentUser({ name, email });
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ name, email, password })
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleLogin = async (
    email,
    password,
    { setPopupType, showInfoTooltip }
  ) => {
    try {
      const data = await auth.authorize({ email, password });
      if (data && data.token) {
        // ✅ Guardar token de forma segura y separada
        localStorage.setItem("jwt", data.token);

        // Pedimos la información del usuario con el token
        const user = await api.getUserInfo();

        // ✅ Usuario limpio SIN token (más seguro)
        const cleanUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          about: user.about || "",
        };

        setCurrentUser(cleanUser);
        localStorage.setItem("currentUser", JSON.stringify(cleanUser));

        // 🔧 Forzar actualización de playlists después del login
        setTimeout(() => {
          window.dispatchEvent(new Event("user-logged-in"));
        }, 100);

        if (typeof setPopupType === "function") setPopupType(null);
        if (typeof showInfoTooltip === "function")
          showInfoTooltip("¡Inicio de sesión exitoso!");
      } else {
        if (typeof showInfoTooltip === "function")
          showInfoTooltip("Error: Token no recibido");
      }
    } catch (err) {
      if (typeof showInfoTooltip === "function")
        showInfoTooltip("Error al iniciar sesión");
      console.error("Login error:", err);
    }
  };

  const handlePopupClose = (evt) => {
    if (evt && typeof evt.preventDefault === "function") {
      evt.preventDefault();
    }
    setPopupType(null);
  };

  const handleShowInfoTooltip = (message) => {
    setTooltipMessage(message);
    setShowTooltip(true);
  };

  const handleUpdateAvatar = async (avatarUrl) => {
    try {
      const response = await api.updateAvatar(avatarUrl);

      // El backend devuelve { message: "...", user: { ... } }
      const updatedUser = response.user || response;

      setCurrentUser((prev) => {
        // ✅ Usuario limpio SIN token
        const cleanUser = {
          _id: prev._id,
          name: prev.name,
          email: prev.email,
          avatar: updatedUser.avatar,
          about: prev.about || "",
        };
        localStorage.setItem("currentUser", JSON.stringify(cleanUser));
        return cleanUser;
      });

      // Mostrar mensaje de éxito
      handleShowInfoTooltip("Avatar actualizado exitosamente");
    } catch (error) {
      console.error("Failed to update avatar:", error.message);
      handleShowInfoTooltip("Error al actualizar avatar");
    }
  };

  const handleUpdateUser = async ({ name, about }) => {
    try {
      // ✅ Manejar about undefined/null como string vacío
      const cleanAbout = about || "";

      const response = await api.updateUser(name, cleanAbout);

      // El backend devuelve { message: "...", user: { ... } }
      const updatedUser = response.user || response;

      setCurrentUser((prev) => {
        // ✅ Usuario limpio SIN token
        const cleanUser = {
          _id: prev._id,
          name: updatedUser.name || name,
          email: prev.email,
          avatar: prev.avatar,
          about: updatedUser.about || cleanAbout,
        };
        localStorage.setItem("currentUser", JSON.stringify(cleanUser));
        return cleanUser;
      });

      handleShowInfoTooltip("Perfil actualizado exitosamente");
      return updatedUser;
    } catch (err) {
      console.error("❌ Error actualizando usuario:", err);
      handleShowInfoTooltip("Error al actualizar perfil");
      throw err;
    }
  };

  const handleLogout = () => {
    console.log("Logging out user:", currentUser);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        handleUpdateAvatar,
        handleUpdateUser,
      }}
    >
      <ToastContainer position="bottom-center" autoClose={3000} />
      <div className="page">
        <Header
          showInfoTooltip={handleShowInfoTooltip}
          popupType={popupType}
          setPopupType={setPopupType}
          handlePopupClose={handlePopupClose}
          handleRegistration={handleRegistration}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Main
                youtubeQuery={youtubeQuery}
                setYoutubeQuery={setYoutubeQuery}
                youtubeResults={youtubeResults}
                selectedVideos={selectedVideos}
                setSelectedVideos={setSelectedVideos}
                onDeleteVideo={handleDeleteVideo}
                onLikeVideo={handleLikeVideo}
                onCreateReview={handleCreateReview}
                onAddToPlaylist={handleAddToPlaylist}
                youtubeInfo={youtubeInfo}
              />
            }
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/aboutMe" element={<AboutMe />} />
        </Routes>
        <Footer />
        {popupType && (
          <Popup
            onClose={handlePopupClose}
            customClassName={popupType.className}
          >
            {popupType.children && popupType.children.type === LoginForm ? (
              <LoginForm {...popupType.children.props} onLogin={handleLogin} />
            ) : (
              popupType.children
            )}
          </Popup>
        )}
        {showTooltip && (
          <InfoTooltip
            message={tooltipMessage}
            onClose={() => setShowTooltip(false)}
          />
        )}
        {showPlaylistModal && (
          <PlaylistModal
            isOpen={showPlaylistModal}
            video={selectedVideoForPlaylist}
            onClose={handlePlaylistModalClose}
            onAddToPlaylist={handleVideoAddedToPlaylist}
          />
        )}
      </div>
    </CurrentUserContext.Provider>
  );
};
