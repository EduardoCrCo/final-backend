import { useState } from "react";
import { SearchBar } from "../Main/components/SearchBar/SearchBar";
import { Videos } from "../Main/components/Videos/Videos";
import { Preloader } from "../Main/components/Preloader/Preloader";

export const Main = ({
  youtubeQuery,
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
      // Simular carga del video (aquí puedes agregar lógica adicional si es necesario)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Agregar el video a selectedVideos
      setSelectedVideos([video, ...selectedVideos]);
    } catch (error) {
      console.error("Error al cargar el video:", error);
    } finally {
      setLoading(false);
      setLoadingVideoId(null);
    }
  };

  return (
    <main className="main-content">
      <h1 className="main-content__title">Explora el mundo desde el aire</h1>
      <h3 className="main-content__subtitle">
        Los mejores videos para aficionados
      </h3>
      <section className="search-bar__container">
        <SearchBar
          onSearch={setYoutubeQuery}
          searchResults={youtubeResults}
          onResultClick={handleResultClick}
          loading={loading}
          loadingVideoId={loadingVideoId}
        />
      </section>

      <section className="videos__container">
        {/* <span
          style={{
            fontSize: 13,
            color: "#666",
            marginLeft: 8,
            display: "block",
            marginBottom: 8,
          }}
        >
          Mostrando resultados para: <b>{youtubeQuery}</b>
        </span> */}

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
