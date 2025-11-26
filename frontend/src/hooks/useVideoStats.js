import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

export const useVideoStats = () => {
  const [videosStats, setVideosStats] = useState([]);
  const [globalStats, setGlobalStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchVideosStats = async () => {
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
      const data = await api.getVideosStats();

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
      console.error("Frontend: Error fetching videos statistics:", err);
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
    fetchVideosStats();
  };

  useEffect(() => {
    fetchVideosStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchVideosStats();
    }, 180000); // 3 min

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
