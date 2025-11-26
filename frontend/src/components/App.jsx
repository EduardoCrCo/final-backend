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
import { Popup } from "./Main/components/Popup/Popup";
import { InfoTooltip } from "./Main/components/forms/InfoTooltip/InfoTooltip";
import { LoginForm } from "./Main/components/forms/LoginForm/LoginForm";
import { PlaylistModal } from "./PlaylistModal/PlaylistModal";
import * as auth from "../utils/auth";
import api from "../utils/api";
import { migrateAuthData } from "../utils/authMigration";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
  const navigate = useNavigate();

  const [youtubeInfo] = useState(null);
  const [youtubeQuery, setYoutubeQuery] = useState("");
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [popupType, setPopupType] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedVideoForPlaylist, setSelectedVideoForPlaylist] =
    useState(null);

  useEffect(() => {
    setYoutubeResults([]);
    if (!youtubeQuery.trim() || youtubeQuery.length < 2) return;

    searchYouTube(youtubeQuery, 12)
      .then((results) => {
        setYoutubeResults(results || []);
      })
      .catch((error) => {
        console.error("App.jsx: Search error:", error);
        setYoutubeResults([]);
      });
  }, [youtubeQuery]);

  useEffect(() => {
    const loadAllVideos = async () => {
      try {
        const response = await api.getAllVideos();
        const videos = response.videos || response;
        setSelectedVideos(videos);

        localStorage.removeItem("selectedVideos");
      } catch (error) {
        console.warn(
          "Backend unavailable, using localStorage fallback:",
          error
        );

        const saved = localStorage.getItem("selectedVideos");
        const fallbackVideos = saved ? JSON.parse(saved) : [];
        setSelectedVideos(fallbackVideos);
        console.log(
          "📦 Using",
          fallbackVideos.length,
          "videos from localStorage"
        );
      }
    };

    loadAllVideos();
  }, []); // Solo al montar la aplicación

  useEffect(() => {
    if (!currentUser && selectedVideos.length > 0) {
      localStorage.setItem("selectedVideos", JSON.stringify(selectedVideos));
    }
  }, [selectedVideos, currentUser]);

  const reloadAllVideos = async () => {
    try {
      const response = await api.getAllVideos();
      const videos = response.videos || response;
      setSelectedVideos(videos);
    } catch (error) {
      console.error("Error reloading videos:", error);
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      await api.deleteVideo(id);

      // Recargar todos los videos desde el backend para mantener sincronización
      await reloadAllVideos();
    } catch (error) {
      console.error("Error deleting from backend:", error.message);

      if (
        error.message.includes("Video no encontrado") ||
        error.message.includes("not found")
      ) {
        setSelectedVideos(selectedVideos.filter((v) => v.video.videoId !== id));
      } else {
        console.error("Real error deleting video:", error.message);
        alert(`Error al eliminar el video: ${error.message}`);
      }
    }
  };

  const handleLikeVideo = async (videoId) => {
    const video = selectedVideos.find((v) => v.video.videoId === videoId);
    if (!video) {
      console.error("Video not found in selectedVideos");
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
      let dbVideo;

      try {
        const response = await api.findVideoByYoutubeId(videoId);
        dbVideo = response.video;
      } catch {
        const saveResult = await api.addVideo(video.video);
        dbVideo = saveResult.video;
      }

      await api.likeVideo(dbVideo._id);

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
      console.error(" Frontend: Error handling like:", error);
      toast.error("Error al procesar el like", {
        position: "bottom-center",
        autoClose: 2000,
      });
    }
  };

  const handleCreateReview = (video) => {
    localStorage.setItem("selectedVideoForReview", JSON.stringify(video));

    navigate("/reviews");
  };

  const handleAddToPlaylist = (video) => {
    setSelectedVideoForPlaylist(video);
    setShowPlaylistModal(true);
  };

  const handlePlaylistModalClose = () => {
    setShowPlaylistModal(false);
    setSelectedVideoForPlaylist(null);
  };

  const handleVideoAddedToPlaylist = (playlistId, video) => {
    toast.success(`Video "${video.title}" agregado a la playlist`, {
      position: "bottom-center",
      autoClose: 2000,
    });
  };

  useEffect(() => {
    migrateAuthData();

    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem("currentUser");
        const token = localStorage.getItem("jwt");

        if (token) {
          try {
            const user = await api.getUserInfo();

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

            if (savedUser) {
              try {
                const parsedUser = JSON.parse(savedUser);

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
          try {
            const parsedUser = JSON.parse(savedUser);

            const { token: _, ...cleanSavedUser } = parsedUser;
            setCurrentUser(cleanSavedUser);
          } catch (parseErr) {
            console.error("Error parsing saved user:", parseErr);
            setCurrentUser(null);
          }
        } else {
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
        localStorage.setItem("jwt", data.token);

        const user = await api.getUserInfo();

        const cleanUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          about: user.about || "",
        };

        setCurrentUser(cleanUser);
        localStorage.setItem("currentUser", JSON.stringify(cleanUser));

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
      const updatedUser = response.user || response;

      setCurrentUser((prev) => {
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

      handleShowInfoTooltip("Avatar actualizado exitosamente");
    } catch (error) {
      console.error("Failed to update avatar:", error.message);
      handleShowInfoTooltip("Error al actualizar avatar");
    }
  };

  const handleUpdateUser = async ({ name, about }) => {
    try {
      const cleanAbout =
        about && about.trim() ? about.trim() : "Usuario sin descripción";

      const response = await api.updateUser(name, cleanAbout);

      const updatedUser = response.user || response;

      setCurrentUser((prev) => {
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
      console.error("Error actualizando usuario:", err);
      handleShowInfoTooltip("Error al actualizar perfil");
      throw err;
    }
  };

  const handleLogout = () => {
    // console.log("Logging out user:", currentUser);
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
                reloadAllVideos={reloadAllVideos}
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
