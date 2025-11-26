import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useUserStats = () => {
  const [usersStats, setUsersStats] = useState([]);
  const [globalStats, setGlobalStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchUsersStats = async () => {
    console.log("📊 Frontend: Fetching users statistics");
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
        "http://localhost:8080/dashboard/users-stats",
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
      console.log("✅ Frontend: Users statistics received:", data);

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
      console.error("❌ Frontend: Error fetching users statistics:", err);
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
    console.log("🔄 Frontend: Refreshing users statistics");
    fetchUsersStats();
  };

  // Fetch inicial al montar el componente
  useEffect(() => {
    fetchUsersStats();
  }, []);

  // Auto-refresh cada 30 segundos (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("⏰ Frontend: Auto-refreshing stats");
      fetchUsersStats();
    }, 180000); // 3 minutos

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
