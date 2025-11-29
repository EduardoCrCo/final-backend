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
    const validAbout =
      about && about.trim() ? about.trim() : "Usuario sin descripción";
    return this._makeRequest("users/me", "PATCH", { name, about: validAbout });
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

    const playlists = response.playlists || response || [];

    return playlists;
  }

  async createPlaylist(name) {
    // try {
    const response = await this._makeRequest("playlists", "POST", { name });

    const playlist = response.playlist || response;
    return playlist;
    // } catch (error) {
    //   throw error;
    // }
  }

  deletePlaylist(playlistId) {
    return this._makeRequest(`playlists/${playlistId}`, "DELETE");
  }

  async addVideoToPlaylist(playlistId, video) {
    let thumbnailUrl = video.thumbnail;
    if (
      !thumbnailUrl &&
      video.thumbnails &&
      Array.isArray(video.thumbnails) &&
      video.thumbnails.length > 0
    ) {
      const thumbnail =
        video.thumbnails.find((t) => t.quality === "high") ||
        video.thumbnails.find((t) => t.quality === "medium") ||
        video.thumbnails[video.thumbnails.length - 1] ||
        video.thumbnails[0];
      thumbnailUrl = thumbnail?.url;
    }

    const videoData = {
      youtubeId: video.videoId || video.youtubeId || video.id,
      title: video.title,
      thumbnail: thumbnailUrl,

      ...(video.description && { description: video.description }),
      ...(video.channelTitle && { channelTitle: video.channelTitle }),
      ...(video.channelName && { channelTitle: video.channelName }),
      ...(video.duration && { duration: video.duration }),
      ...(video.publishedAt && { publishedAt: video.publishedAt }),
    };

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

  getAllVideos() {
    return this._makeRequest("videos");
  }

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

  getUsersStats() {
    return this._makeRequest("dashboard/users-stats");
  }

  getVideosStats() {
    return this._makeRequest("dashboard/videos-stats");
  }

  searchYouTube(query, maxResults = 12) {
    const encodedQuery = encodeURIComponent(query);
    return this._makeRequest(
      `videos/search?q=${encodedQuery}&maxResults=${maxResults}`
    );
  }

  _makeRequest(path, method = "GET", body = {}) {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

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

      try {
        const json = await res.json();

        console.error(`API Error ${res.status}:`, json);

        // Si hay detalles de validación, incluirlos en el mensaje
        if (json.validation && json.validation.body) {
          const validationErrors = json.validation.body.details || [];
          "Validation details:", json.validation;
          const errorMessages = validationErrors
            .map((err) => `${err.path?.join(".")}: ${err.message}`)
            .join(", ");
          throw new Error(`Validation failed: ${errorMessages}`);
        }

        throw new Error(json.message || `HTTP Error ${res.status}`);
      } catch (parseError) {
        if (parseError.name === "SyntaxError") {
          console.error(`API Error ${res.status} (Invalid JSON):`, parseError);
          throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
        }
        throw parseError;
      }
    });
  }
}

const api = new Api("https://final-backend-q1ug.onrender.com");

export default api;
