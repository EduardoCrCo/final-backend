// utils/ThirdPartyApi.js
// Funciones para interactuar con el servicio de terceros (por ejemplo, YouTube API)

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; // Usar variable de entorno
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

// se pueden agregar más funciones para otros endpoints si es necesario

// export async function searchYouTube(query) {
//   const response = await fetch(
//     `/api/youtube/search?q=${encodeURIComponent(query)}`
//   );

//   if (!response.ok) {
//     throw new Error("Error al buscar videos en YouTube desde backend");
//   }

//   const data = await response.json();
//   return data.items;
// }
