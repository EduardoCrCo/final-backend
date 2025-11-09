import { SearchBar } from "../Main/components/SearchBar/SearchBar";
import { Videos } from "../Main/components/Videos/Videos";

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
          onResultClick={(video) =>
            setSelectedVideos([video, ...selectedVideos])
          }
        />
      </section>

      <section className="videos__container">
        <span
          style={{
            fontSize: 13,
            color: "#666",
            marginLeft: 8,
            display: "block",
            marginBottom: 8,
          }}
        >
          Mostrando resultados para: <b>{youtubeQuery}</b>
        </span>
        <Videos
          videos={selectedVideos}
          onDelete={onDeleteVideo}
          onLiked={onLikeVideo}
          onCreateReview={onCreateReview}
          onAddToPlaylist={onAddToPlaylist}
          youtubeInfo={youtubeInfo}
        />
      </section>
    </main>
  );
};
