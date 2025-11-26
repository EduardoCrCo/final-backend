import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

export const useUserStats = () => {
  const [usersStats, setUsersStats] = useState([]);
  const [globalStats, setGlobalStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchUsersStats = async () => {
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
      const data = await api.getUsersStats();

      setUsersStats(data.users || []);
      setGlobalStats(data.globalStats || {});
      setLastUpdated(new Date(data.timestamp));

      toast.success(
        `Estadísticas actualizadas: ${data.users.length} usuarios`,
        {
          position: "bottom-center",
          autoClose: 2000,
        }
      );
    } catch (err) {
      console.error("Frontend: Error fetching users statistics:", err);
      setError(err.message);

      toast.error(`Error al cargar estadísticas: ${err.message}`, {
        position: "bottom-center",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    fetchUsersStats();
  };

  useEffect(() => {
    fetchUsersStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsersStats();
    }, 180000); // 3 min

    return () => clearInterval(interval);
  }, []);

  return {
    usersStats,
    globalStats,
    loading,
    error,
    lastUpdated,
    refreshStats,
    fetchUsersStats,
  };
};
