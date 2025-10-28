import { useState, useEffect } from "react";
import { SearchBar } from "../Main/components/SearchBar/SearchBar";
import { Videos } from "../Main/components/Videos/Videos";
import { mockVideos } from "../../utils/utils";
// import {VideosContext} from "../../context/VideosContext";

export const Main = () => {
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem("videos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("videos", JSON.stringify(videos));
  }, [videos]);

  const [searchResults, setSearchResults] = useState([]);
  const [isSearchResultActive, setIsSearchResultActive] = useState(false);
  const handleSearch = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearchResultActive(false);
      return;
    }
    const results = mockVideos.filter((video) =>
      video.title.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
    setIsPopupOpen(results.length > 0);
  };

  const handleAddVideos = (video) => {
    //evitamos duplicados
    if (!videos.find((v) => v.id === video.id)) {
      setVideos([video, ...videos]);
    }
    setSearchResults([]); //limpiamos resultados
    setIsPopupOpen(false); //cerramos el popup
  };

  // Eliminar video por id
  const handleDeleteVideo = (id) => {
    setVideos((prev) => prev.filter((video) => video.id !== id));
  };

  return (
    // <VideosContext.Provider value={{ videos, setVideos }}>
    <main className="main-content">
      <section className="search-bar__container">
        <SearchBar
          onSearch={handleSearch}
          searchResults={searchResults}
          onResultClick={handleAddVideos}
        />
      </section>

      <section className="videos__container">
        <Videos videos={videos} onDelete={handleDeleteVideo} />
      </section>
    </main>
    // </VideosContext.Provider>
  );
};
