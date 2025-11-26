import api from "./api.js";

export async function searchYouTube(query, maxResults = 12) {
  try {
    const data = await api.searchYouTube(query, maxResults);
    const results = data.results || data || [];
    return results;
  } catch (error) {
    console.error("Frontend: YouTube search error:", error);
    throw new Error(
      `Error al buscar videos en YouTube desde backend: ${error.message}`
    );
  }
}
