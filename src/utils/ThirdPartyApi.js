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
