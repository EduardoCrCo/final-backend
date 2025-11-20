import { config } from "dotenv";
config();
const API_KEY = process.env.YOUTUBE_API_KEY; // Usar variable de entorno
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

/**
 * Busca videos en YouTube usando fetch y la API oficial
 * @param {string} query - Término de búsqueda
 * @param {number} maxResults - Número máximo de resultados
 * @returns {Promise<Object[]>} - Lista de videos
 */
export async function searchYouTube(query, maxResults = 8) {
  const url = `${BASE_URL}?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(
    query
  )}&key=${API_KEY}`;
  // const response = await fetch(`/videos/search?q=${term}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error al buscar videos en YouTube");
  }
  const data = await response.json();
  // Mapea los resultados a un formato más simple
  return data.items.map((item) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    thumbnails: item.snippet.thumbnails
      ? Object.values(item.snippet.thumbnails)
      : [],
  }));
}
