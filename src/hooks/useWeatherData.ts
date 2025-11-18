// import { useState, useCallback } from 'react';

// interface WeatherData {
//   dia: string;
//   Temperatura: number;
//   Lluvia: number;
// }

// interface UseWeatherDataReturn {
//   data: WeatherData[];
//   loading: boolean;
//   error: string | null;
//   fetchWeatherData: (cityName: string) => Promise<void>;
//   clearError: () => void;
// }

// const API_KEY = "1754ac1ac1824d7f9a525648251211"; // TODO: Move to environment variables
// const API_BASE_URL = "https://api.weatherapi.com/v1";

// export const useWeatherData = (): UseWeatherDataReturn => {
//   const [data, setData] = useState<WeatherData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchWeatherData = useCallback(async (cityName: string) => {
//     if (!cityName.trim()) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${cityName}&days=7&lang=es`
//       );
      
//       if (!response.ok) {
//         throw new Error("No se pudo obtener el clima.");
//       }
      
//       const apiData = await response.json();
      
//       const formatted: WeatherData[] = apiData.forecast.forecastday.map((d: any) => ({
//         dia: new Date(d.date).toLocaleDateString("es-MX", {
//           weekday: "short",
//         }),
//         Temperatura: d.day.avgtemp_c,
//         Lluvia: d.day.daily_chance_of_rain,
//       }));

//       setData(formatted);
//     } catch (err: any) {
//       console.error('Weather API Error:', err);
//       setError(err.message || "Error desconocido");
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   return {
//     data,
//     loading,
//     error,
//     fetchWeatherData,
//     clearError
//   };
// };

import { useState, useCallback } from 'react';

interface WeatherData {
  dia: string;
  Temperatura: number;
  Lluvia: number;
}

interface UseWeatherDataReturn {
  data: WeatherData[];
  loading: boolean;
  error: string | null;
  condition: string | null;  // 👈 ESTADO NUEVO
  fetchWeatherData: (cityName: string) => Promise<void>;
  clearError: () => void;
}

const API_KEY = "1754ac1ac1824d7f9a525648251211"; // TODO: Move to environment variables
const API_BASE_URL = "https://api.weatherapi.com/v1";

export const useWeatherData = (): UseWeatherDataReturn => {
  const [data, setData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [condition, setCondition] = useState<string | null>(null); // 👈 NUEVO

  const fetchWeatherData = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${cityName}&days=7&lang=es`
      );
      
      if (!response.ok) {
        throw new Error("No se pudo obtener el clima.");
      }
      
      const apiData = await response.json();

      // 👇 Guardamos la condición del clima actual
      // Ej: "Sunny", "Cloudy", "Rain", "Snow", etc.
      setCondition(apiData.current?.condition?.text || null);

      // Mapeo de datos para la gráfica
      const formatted: WeatherData[] = apiData.forecast.forecastday.map((d: any) => ({
        dia: new Date(d.date).toLocaleDateString("es-MX", {
          weekday: "short",
        }),
        Temperatura: d.day.avgtemp_c,
        Lluvia: d.day.daily_chance_of_rain,
      }));

      setData(formatted);
    } catch (err: any) {
      console.error('Weather API Error:', err);
      setError(err.message || "Error desconocido");
      setData([]);
      setCondition(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    condition,       // 👈 LO EXPONEMOS AQUÍ
    fetchWeatherData,
    clearError,
  };
};
