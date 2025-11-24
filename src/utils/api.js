class Api {
  constructor(url, token) {
    this._url = url;
    this._token = token;
  }

  _getToken() {
    const token = localStorage.getItem("jwt");
    return token ? `Bearer ${token}` : null;
  }

  getUserInfo() {
    return this._makeRequest("users/me");
  }

  getCards() {
    return this._makeRequest("cards");
  }

  updateUser(name, about) {
    return this._makeRequest("users/me", "PATCH", { name, about });
  }

  addCard(name, link) {
    return this._makeRequest("cards", "POST", { name, link });
  }

  deleteCard(cardId) {
    return this._makeRequest(`cards/${cardId}`, "DELETE");
  }

  updateAvatar(avatar) {
    return this._makeRequest("users/me/avatar", "PATCH", { avatar });
  }

  likeCard(cardId) {
    return this._makeRequest(`cards/${cardId}/likes`, "PUT");
  }

  deleteLikeCard(cardId) {
    return this._makeRequest(`cards/${cardId}/likes`, "DELETE");
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getCards()]);
  }

  getPlaylists() {
    return this._makeRequest("playlists");
  }

  async getUserPlaylists() {
    const response = await this._makeRequest("playlists");
    console.log("🔍 getUserPlaylists response:", response);

    const playlists = response.playlists || response || [];
    console.log("🔍 getUserPlaylists playlists:", playlists);

    return playlists;
  }

  async createPlaylist(name) {
    console.log("🚀 createPlaylist:", name);
    try {
      const response = await this._makeRequest("playlists", "POST", { name });
      console.log("✅ createPlaylist success:", response);

      const playlist = response.playlist || response;
      return playlist;
    } catch (error) {
      console.log("❌ createPlaylist error:", error);
      throw error;
    }
  }

  deletePlaylist(playlistId) {
    return this._makeRequest(`playlists/${playlistId}`, "DELETE");
  }

  async addVideoToPlaylist(playlistId, video) {
    // Extraer thumbnail del array de thumbnails si existe
    let thumbnailUrl = video.thumbnail;
    if (
      !thumbnailUrl &&
      video.thumbnails &&
      Array.isArray(video.thumbnails) &&
      video.thumbnails.length > 0
    ) {
      // Buscar el thumbnail de mejor calidad (generalmente el último o 'high'/'medium')
      const thumbnail =
        video.thumbnails.find((t) => t.quality === "high") ||
        video.thumbnails.find((t) => t.quality === "medium") ||
        video.thumbnails[video.thumbnails.length - 1] ||
        video.thumbnails[0];
      thumbnailUrl = thumbnail?.url;
    }

    // Transformar el objeto video a la estructura esperada por el backend
    const videoData = {
      youtubeId: video.videoId || video.youtubeId || video.id,
      title: video.title,
      thumbnail: thumbnailUrl,
      // Incluir campos adicionales si los hay
      ...(video.description && { description: video.description }),
      ...(video.channelTitle && { channelTitle: video.channelTitle }),
      ...(video.channelName && { channelTitle: video.channelName }), // Mapear channelName a channelTitle
      ...(video.duration && { duration: video.duration }),
      ...(video.publishedAt && { publishedAt: video.publishedAt }),
    };

    console.log("🔍 addVideoToPlaylist original video:", video);
    console.log("🔍 addVideoToPlaylist transformed data:", videoData);

    const response = await this._makeRequest(
      `playlists/${playlistId}/add`,
      "POST",
      videoData
    );
    return response.playlist || response;
  }

  async removeVideoFromPlaylist(playlistId, videoId) {
    const response = await this._makeRequest(
      `playlists/${playlistId}/remove/${videoId}`,
      "DELETE"
    );
    return response.playlist || response;
  }

  // Métodos para Reviews
  getUserReviews() {
    return this._makeRequest("reviews");
  }

  getPublicReviews(limit = 20, skip = 0, videoId = null) {
    const params = new URLSearchParams({ limit, skip });
    if (videoId) params.append("videoId", videoId);
    return this._makeRequest(`reviews/public?${params}`);
  }

  getReviewById(reviewId) {
    return this._makeRequest(`reviews/${reviewId}`);
  }

  createReview(reviewData) {
    return this._makeRequest("reviews", "POST", reviewData);
  }

  updateReview(reviewId, reviewData) {
    return this._makeRequest(`reviews/${reviewId}`, "PUT", reviewData);
  }

  deleteReview(reviewId) {
    return this._makeRequest(`reviews/${reviewId}`, "DELETE");
  }

  // Métodos para Videos
  deleteVideo(youtubeId) {
    return this._makeRequest(`videos/${youtubeId}`, "DELETE");
  }

  findVideoByYoutubeId(youtubeId) {
    return this._makeRequest(`videos/find/${youtubeId}`);
  }

  addVideo(videoData) {
    return this._makeRequest("videos/add", "POST", videoData);
  }

  likeVideo(videoId) {
    return this._makeRequest(`videos/${videoId}/like`, "POST");
  }

  getReviewStats() {
    return this._makeRequest("reviews/stats");
  }

  _makeRequest(path, method = "GET", body = {}) {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    //const token = this._getToken();
    // if (token) {
    //   config.headers.Authorization = token;
    // }
    const token = this._getToken();
    config.headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: token }),
    };

    if (method !== "GET" && method !== "DELETE") {
      config["body"] = JSON.stringify(body);
    }
    return fetch(`${this._url}${path}`, config).then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      const json = await res.json();
      throw new Error(json.message);
    });
  }
}

const api = new Api("http://localhost:8080/");

export default api;
