import { useState, useRef, useEffect } from "react";
import SearchIcon from "../../../../images/search.png";

export const SearchBar = ({ onSearch, searchResults = [], onResultClick }) => {
  const [term, setTerm] = useState("");
  const wrapperRef = useRef(); // Marcador de posición para posible uso futuro

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onSearch(""); // limpia resultados si hace clic fuera
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term);
  };

  const handleResultClick = (video) => {
    onResultClick(video);
    setTerm("");
    onSearch(""); // Limpia resultados
  };

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
        <img src={SearchIcon} alt="search" className="search-bar__icon" />
      </form>
      {searchResults.length > 0 && term && (
        <ul className="search-results-dropdown">
          {searchResults.map((video) => (
            <li key={video.id} onClick={() => handleResultClick(video)}>
              {video.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
