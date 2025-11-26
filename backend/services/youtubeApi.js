import { config } from "dotenv";

config();
const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

/**
 * @param {string} query
 * @param {number} maxResults
 * @returns {Promise<Object[]>}
 */
/**

 * @param {string} videoId
 * @returns {Promise<Object>}
 */
/**

 * @param {string} isoDuration
 * @returns {string}
 */
function formatDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return "0:00";

  const hours = parseInt(match[1], 10) || 0;
  const minutes = parseInt(match[2], 10) || 0;
  const seconds = parseInt(match[3], 10) || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export async function getVideoDetails(videoId) {
  if (!API_KEY) {
    throw new Error("YouTube API Key no configurada");
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("YouTube API Error:", errorText);
    throw new Error(`YouTube API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error(`Video not found: ${videoId}`);
  }

  const video = data.items[0];

  const duration = formatDuration(video.contentDetails.duration);

  return {
    videoId: video.id,
    title: video.snippet.title,
    channelName: video.snippet.channelTitle,
    thumbnails: video.snippet.thumbnails,
    description: video.snippet.description || "",
    publishedAt: video.snippet.publishedAt
      ? new Date(video.snippet.publishedAt)
      : new Date(),
    duration,
  };
}

export async function searchYouTube(query, maxResults = 8) {
  if (!API_KEY) {
    throw new Error("YouTube API Key no configurada");
  }

  const url = `${BASE_URL}?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(
    query
  )}&key=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("YouTube API Error:", errorText);
    throw new Error(`YouTube API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

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

  return results;
}
