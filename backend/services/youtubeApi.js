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
  console.log(
    "🎬 YouTube API: Searching for:",
    query,
    "with API key:",
    API_KEY ? "Present" : "Missing"
  );

  if (!API_KEY) {
    throw new Error("YouTube API Key no configurada");
  }

  const url = `${BASE_URL}?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(
    query
  )}&key=${API_KEY}`;

  console.log(
    "🔗 YouTube API: Request URL (without key):",
    url.replace(API_KEY, "[HIDDEN]")
  );

  const response = await fetch(url);

  console.log(
    "📡 YouTube API: Response status:",
    response.status,
    response.statusText
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ YouTube API Error:", errorText);
    throw new Error(`YouTube API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(
    "✅ YouTube API: Raw response items count:",
    data.items?.length || 0
  );

  // Mapea los resultados a un formato más simple
  const results = data.items.map((item) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    thumbnails: item.snippet.thumbnails
      ? Object.values(item.snippet.thumbnails)
      : [],
    description: item.snippet.description || "",
    publishedAt: item.snippet.publishedAt
      ? new Date(item.snippet.publishedAt)
      : new Date(),
  }));

  console.log("🎯 YouTube API: Formatted results:", results.length);
  return results;
}
