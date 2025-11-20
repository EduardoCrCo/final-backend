import { useState, useRef, useEffect } from "react";
import SearchIcon from "../../../../images/Search.svg";

export const SearchBar = ({
  onSearch,
  searchResults = [],
  onResultClick,
  loading,
  loadingVideoId,
}) => {
  const [term, setTerm] = useState("");
  const wrapperRef = useRef();

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setTerm("");
        onSearch(""); // limpia resultados si hace clic fuera
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onSearch]);

  // Elimina el efecto que limpia el input automáticamente

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim().length > 1) {
      onSearch(term);
    }
  };

  const handleResultClick = async (video) => {
    await onResultClick(video);
    setTerm("");
    onSearch(""); // Limpia resultados
  };

  // const handleResultClick = async (video) => {
  //   setLoading(true);

  //   // Si hay una API, aquí la llamas...
  //   await new Promise((res) => setTimeout(res, 1200));

  //   // Muestra el video seleccionado en Videos
  //   setVideos([video]);

  //   setLoading(false);
  // };

  const uniqueResults = Array.from(
    new Map(searchResults.map((v) => [v.video.videoId, v])).values()
  );

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="search-bar__form">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar videos..."
          className="search-bar__input"
        />

        <img
          src={SearchIcon}
          alt="search"
          className="search-bar__icon"
          onClick={() => {
            if (term.trim().length > 1) {
              onSearch(term);
            }
          }}
        />
      </form>

      {searchResults.length > 0 && term && (
        <ul className="search-results-dropdown">
          {uniqueResults.map((video) => (
            <li
              key={video.video?.videoId}
              onClick={() => handleResultClick(video)}
              className={`search-result-item ${
                loadingVideoId === video.video?.videoId ? "loading" : ""
              }`}
              style={{
                position: "relative",
                opacity: loadingVideoId === video.video.videoId ? 0.6 : 1,
                pointerEvents: loading ? "none" : "auto",
              }}
            >
              {video.title}
              {loadingVideoId === video.video.videoId && (
                <div
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <div className="mini-spinner"></div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
