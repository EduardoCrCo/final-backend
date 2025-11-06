import { useState, useRef, useEffect } from "react";
import SearchIcon from "../../../../images/Search.svg";

export const SearchBar = ({ onSearch, searchResults = [], onResultClick }) => {
  const [term, setTerm] = useState("");
  // El input solo se limpia al seleccionar un resultado o hacer click fuera
  const wrapperRef = useRef(); // Marcador de posición para posible uso futuro

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
