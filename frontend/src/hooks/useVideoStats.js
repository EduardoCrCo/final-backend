import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useVideoStats = () => {
  const [videosStats, setVideosStats] = useState([]);
  const [globalStats, setGlobalStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchVideosStats = async () => {
    console.log("🎬 Frontend: Fetching videos statistics");
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("jwt");

    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      toast.error("Debes estar logueado para ver estadísticas", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/dashboard/videos-stats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Token de autenticación inválido");
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Frontend: Videos statistics received:", data);
      console.log(
        "📊 Frontend: Videos array length:",
        data.videos ? data.videos.length : 0
      );
      console.log(
        "📊 Frontend: First video sample:",
        data.videos ? data.videos[0] : "No videos"
      );

      setVideosStats(data.videos || []);
      setGlobalStats(data.globalStats || {});
      setLastUpdated(new Date(data.timestamp));

      toast.success(
        `Estadísticas de videos actualizadas: ${data.videos.length} videos`,
        {
          position: "bottom-center",
          autoClose: 2000,
        }
      );
    } catch (err) {
      console.error("❌ Frontend: Error fetching videos statistics:", err);
      setError(err.message);

      toast.error(`Error al cargar estadísticas de videos: ${err.message}`, {
        position: "bottom-center",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    console.log("🔄 Frontend: Refreshing videos statistics");
    fetchVideosStats();
  };

  // Fetch inicial al montar el componente
  useEffect(() => {
    fetchVideosStats();
  }, []);

  // Auto-refresh cada 45 segundos (más lento que users por ser más datos)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("⏰ Frontend: Auto-refreshing video stats");
      fetchVideosStats();
    }, 180000); // 3 minutos

    return () => clearInterval(interval);
  }, []);

  return {
    videosStats,
    globalStats,
    loading,
    error,
    lastUpdated,
    refreshStats,
    fetchVideosStats,
  };
};
