// utils/ThirdPartyApi.js
// Funciones para interactuar con el servicio de terceros (por ejemplo, YouTube API)

// const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; // Usar variable de entorno
// const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

// /**
//  * Busca videos en YouTube usando fetch y la API oficial
//  * @param {string} query - Término de búsqueda
//  * @param {number} maxResults - Número máximo de resultados
//  * @returns {Promise<Object[]>} - Lista de videos
//  */
// export async function searchYouTube(query, maxResults = 8) {
//   const url = `${BASE_URL}?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(
//     query
//   )}&key=${API_KEY}`;
//   // const response = await fetch(`/videos/search?q=${term}`);
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Error al buscar videos en YouTube");
//   }
//   const data = await response.json();
//   // Mapea los resultados a un formato más simple
//   return data.items.map((item) => ({
//     videoId: item.id.videoId,
//     title: item.snippet.title,
//     channelName: item.snippet.channelTitle,
//     thumbnails: item.snippet.thumbnails
//       ? Object.values(item.snippet.thumbnails)
//       : [],
//   }));
// }

// se pueden agregar más funciones para otros endpoints si es necesario

export async function searchYouTube(query, maxResults = 12) {
  console.log("🔍 Frontend: Searching YouTube for:", query);

  // Obtener token de autenticación si existe
  const token = localStorage.getItem("jwt");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log("🔐 Frontend: Adding auth token to request");
  } else {
    console.log("👤 Frontend: No auth token found, searching as guest");
  }

  const response = await fetch(
    `http://localhost:8080/videos/search?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: headers,
    }
  );

  console.log(
    "📡 Frontend: Response status:",
    response.status,
    response.statusText
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Frontend: YouTube search error:", errorText);
    throw new Error(
      "Error al buscar videos en YouTube desde backend: " + response.status
    );
  }

  const data = await response.json();
  console.log("✅ Frontend: YouTube search results:", data.length);

  // El backend ya devuelve los datos en el formato correcto
  return data;
}
