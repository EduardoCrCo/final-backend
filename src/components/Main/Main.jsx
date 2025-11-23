import { useState } from "react";
import { SearchBar } from "../Main/components/SearchBar/SearchBar";
import { Videos } from "../Main/components/Videos/Videos";
import { Preloader } from "../Main/components/Preloader/Preloader";
import { toast } from "react-toastify";

export const Main = ({
  setYoutubeQuery,
  youtubeResults,
  selectedVideos,
  setSelectedVideos,
  onDeleteVideo,
  onLikeVideo,
  onCreateReview,
  onAddToPlaylist,
  youtubeInfo,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingVideoId, setLoadingVideoId] = useState(null);

  const handleResultClick = async (video) => {
    setLoading(true);
    setLoadingVideoId(video.video.videoId);

    try {
      // Detectar si el video YA existe
      const exists = selectedVideos.some(
        (v) => v.video.videoId === video.video.videoId
      );

      if (exists) {
        toast.info("⚠️ Este video ya está en la lista.", {
          position: "bottom-center",
          autoClose: 2000,
        });
        return; //no lo agregues de nuevo
      }

      // Guardar en backend si hay usuario autenticado
      const token = localStorage.getItem("jwt");
      if (token) {
        const response = await fetch("http://localhost:8080/videos/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ videoData: video.video }),
        });

        if (response.ok) {
          const savedVideo = await response.json();

          setSelectedVideos([savedVideo, ...selectedVideos]);
        } else {
          throw new Error("Error al guardar video en backend");
        }
      } else {
        // Si no hay usuario, solo agregar localmente

        setSelectedVideos([video, ...selectedVideos]);
      }
    } catch (error) {
      console.error("Frontend: Error saving video:", error);
      toast.error("Error al agregar el video", {
        position: "bottom-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
      setLoadingVideoId(null);
    }
  };

  return (
    <main className="main-content">
      {/* <section className="search-bar__container hero-section">
        <h1 className="main-content__title">Explora el mundo desde el aire</h1>
        <h3 className="main-content__subtitle">
          Los mejores videos para aficionados
        </h3>

        <SearchBar
          onSearch={setYoutubeQuery}
          searchResults={youtubeResults}
          onResultClick={handleResultClick}
          loading={loading}
          loadingVideoId={loadingVideoId}
        />
      </section> */}
      <section className="search-bar__container hero">
        <div className="hero__overlay"></div>

        <div className="hero__content">
          <h1 className="hero__title">Explora el mundo desde el aire</h1>
          <h3 className="hero__subtitle">
            Los mejores videos para aficionados
          </h3>

          <SearchBar
            onSearch={setYoutubeQuery}
            searchResults={youtubeResults}
            onResultClick={handleResultClick}
            loading={loading}
            loadingVideoId={loadingVideoId}
          />
        </div>
      </section>

      <section className="videos__container">
        {/* Mostrar preloader cuando se está cargando un video */}
        {loading && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <Preloader message="Cargando video seleccionado..." />
          </div>
        )}

        <Videos
          videos={selectedVideos}
          onDelete={onDeleteVideo}
          onLiked={onLikeVideo}
          onCreateReview={onCreateReview}
          onAddToPlaylist={onAddToPlaylist}
          youtubeInfo={youtubeInfo}
          loading={loading}
          loadingVideoId={loadingVideoId}
        />
      </section>
    </main>
  );
};
