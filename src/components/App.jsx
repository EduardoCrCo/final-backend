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
import { ToastContainer } from "react-toastify";
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
        const ytResults = (results || []).map((item) => ({
          id: item.videoId,
          title: item.title,
          type: "youtube",
          video: {
            videoId: item.videoId,
            title: item.title,
            thumbnails: item.thumbnails,
            channelName: item.channelName,
          },
        }));
        setYoutubeResults(ytResults);
      })
      .catch((error) => console.error(error));
  }, [youtubeQuery]);

  useEffect(() => {
    localStorage.setItem("selectedVideos", JSON.stringify(selectedVideos));
  }, [selectedVideos]);

  const handleDeleteVideo = (id) => {
    setSelectedVideos(selectedVideos.filter((v) => v.video.videoId !== id));
  };

  const handleLikeVideo = (id) => {
    setSelectedVideos(
      selectedVideos.map((v) =>
        v.video.videoId === id ? { ...v, liked: !v.liked } : v
      )
    );
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
    // Try to get user info from API (if token is valid)
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem("currentUser");
        const token = localStorage.getItem("jwt");

        if (token) {
          // Si hay token, intentar obtener info del backend
          try {
            const user = await api.getUserInfo();
            const mergedUser = { ...user, token };
            setCurrentUser(mergedUser);
            localStorage.setItem("currentUser", JSON.stringify(mergedUser));
          } catch (apiError) {
            console.error("API error:", apiError);
            // Si falla API pero hay usuario guardado, usarlo
            if (savedUser) {
              setCurrentUser(JSON.parse(savedUser));
            } else {
              setCurrentUser(null);
            }
          }
        } else if (savedUser) {
          // Sin token pero con usuario guardado
          try {
            setCurrentUser(JSON.parse(savedUser));
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
      // if (data && data.token) {
      //   localStorage.setItem("jwt", data.token);
      //   const user = await api.getUserInfo();
      //   setCurrentUser(user);
      //   localStorage.setItem("currentUser", JSON.stringify(user));
      if (data && data.token) {
        localStorage.setItem("jwt", data.token);

        // Pedimos la información del usuario con el token
        const user = await api.getUserInfo();

        const mergedUser = {
          ...user,
          token: data.token, // 🔥 GUARDA EL TOKEN DENTRO DEL USUARIO
        };

        setCurrentUser(mergedUser);
        localStorage.setItem("currentUser", JSON.stringify(mergedUser));

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
    // console.log("🔄 handleUpdateAvatar llamado con URL:", avatarUrl);
    try {
      const response = await api.updateAvatar(avatarUrl);
      // console.log("📡 Respuesta del backend:", response);

      // El backend devuelve { message: "...", user: { ... } }
      const updatedUser = response.user || response;
      // console.log("👤 Usuario actualizado:", updatedUser);

      setCurrentUser((prev) => {
        const newUser = { ...prev, ...updatedUser };
        // console.log("🔄 Estado anterior:", prev);
        // console.log("🔄 Nuevo estado:", newUser);
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        return newUser;
      });

      // Mostrar mensaje de éxito
      handleShowInfoTooltip("Avatar actualizado exitosamente");
    } catch (error) {
      console.error("❌ Failed to update avatar:", error.message);
      handleShowInfoTooltip("Error al actualizar avatar");
    }
  };

  const handleUpdateUser = async ({ name, about }) => {
    // console.log("🔄 handleUpdateUser llamado con:", { name, about });
    try {
      const response = await api.updateUser(name, about);
      // console.log("📡 Respuesta del backend:", response);

      // El backend devuelve { message: "...", user: { ... } }
      const updatedUser = response.user || response;
      // console.log("👤 Usuario actualizado:", updatedUser);

      setCurrentUser((prev) => {
        const newUser = { ...prev, ...updatedUser };
        // console.log("🔄 Estado anterior:", prev);
        // console.log("🔄 Nuevo estado:", newUser);
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        return newUser;
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
    localStorage.removeItem("jwt"); // <-- elimina el token
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
