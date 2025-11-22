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

  getUserPlaylists() {
    return this._makeRequest("playlists");
  }

  createPlaylist(name) {
    return this._makeRequest("playlists", "POST", { name });
  }

  deletePlaylist(playlistId) {
    return this._makeRequest(`playlists/${playlistId}`, "DELETE");
  }

  addVideoToPlaylist(playlistId, video) {
    return this._makeRequest(`playlists/${playlistId}/add`, "POST", video);
  }

  removeVideoFromPlaylist(playlistId, videoId) {
    return this._makeRequest(
      `playlists/${playlistId}/remove/${videoId}`,
      "DELETE"
    );
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
