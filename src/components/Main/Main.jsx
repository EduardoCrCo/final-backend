import { useState, useEffect } from "react";
import { SearchBar } from "../Main/components/SearchBar/SearchBar";
import { Videos } from "../Main/components/Videos/Videos";
import { searchYouTube } from "../../utils/ThirdPartyApi";

export const Main = () => {
  const [youtubeInfo, setYoutubeInfo] = useState(null);
  const [youtubeQuery, setYoutubeQuery] = useState("");

  const [youtubeResults, setYoutubeResults] = useState([]);
  //const [selectedVideos, setSelectedVideos] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

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

  //1. estado de los videos locales
  //aqui se inicia el estado videos con los videos locales que se guardan en localStorage
  const [selectedVideos, setSelectedVideos] = useState(() => {
    const saved = localStorage.getItem("selectedVideos");
    return saved ? JSON.parse(saved) : [];
  });

  //2. Persistencia en localStorage
  //cada vez que se cambian los videos locales se actualiza el localStorage
  useEffect(() => {
    localStorage.setItem("selectedVideos", JSON.stringify(selectedVideos));
  }, [selectedVideos]);

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
          onDelete={(id) =>
            setSelectedVideos(
              selectedVideos.filter((v) => v.video.videoId !== id)
            )
          }
          onLiked={(id) =>
            setSelectedVideos(
              selectedVideos.map((v) =>
                v.video.videoId === id ? { ...v, liked: !v.liked } : v
              )
            )
          }
          youtubeInfo={youtubeInfo}
        />
      </section>
    </main>
  );
};
