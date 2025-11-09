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
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    // Try to get user info from API (if token is valid)
    api
      .getUserInfo()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((err) => {
        // fallback to localStorage if API fails
        const user = localStorage.getItem("currentUser");
        if (user) {
          setCurrentUser(JSON.parse(user));
        } else {
          setCurrentUser(null);
        }
      });
  }, []);
  // const handleUpdateUser = async (userData) => {
  //   try {
  //     // The updateUser function eventually calls the problematic fetch logic in api.js
  //     const updatedUser = await api.updateUser(userData.name);
  //     // Handle successful update (e.g., update state, show success message)
  //     console.log("User updated successfully:", updatedUser);
  //   } catch (error) {
  //     // This catch block will now handle the "Validation failed" error
  //     // thrown from api.js, as well as any other errors in the promise chain.
  //     console.error("Failed to update user:", error.message);
  //     // You can display this error to the user, e.g., using a state variable
  //     // setError(error.message);
  //   }
  // };

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

  // Centralized login handler for LoginForm
  const handleLogin = async (
    email,
    password,
    { setPopupType, showInfoTooltip }
  ) => {
    try {
      const data = await auth.authorize({ email, password });
      if (data && data.token) {
        localStorage.setItem("jwt", data.token);
        // Optionally, fetch user info after login
        const user = await api.getUserInfo();
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
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

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="page">
        <Header
          showInfoTooltip={handleShowInfoTooltip}
          popupType={popupType}
          setPopupType={setPopupType}
          handlePopupClose={handlePopupClose}
          handleRegistration={handleRegistration}
          //handleLogout={handleLogout}
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
            {/* If the popup is LoginForm, inject onLogin handler */}
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
