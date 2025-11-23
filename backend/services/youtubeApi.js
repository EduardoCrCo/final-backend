import { config } from 'dotenv'

config()
const API_KEY = process.env.YOUTUBE_API_KEY // Usar variable de entorno
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search'

/**
 * Busca videos en YouTube usando fetch y la API oficial
 * @param {string} query - Término de búsqueda
 * @param {number} maxResults - Número máximo de resultados
 * @returns {Promise<Object[]>} - Lista de videos
 */
/**
 * Obtiene detalles completos de un video incluyendo duración
 * @param {string} videoId - ID del video de YouTube
 * @returns {Promise<Object>} - Detalles del video
 */
export async function getVideoDetails(videoId) {
  console.log('📹 YouTube API: Getting details for video:', videoId)

  if (!API_KEY) {
    throw new Error('YouTube API Key no configurada')
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`

  const response = await fetch(url)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ YouTube API Error:', errorText)
    throw new Error(`YouTube API Error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  if (!data.items || data.items.length === 0) {
    throw new Error(`Video not found: ${videoId}`)
  }

  const video = data.items[0]

  // Convertir duración ISO 8601 (PT4M13S) a formato legible
  const duration = formatDuration(video.contentDetails.duration)

  return {
    videoId: video.id,
    title: video.snippet.title,
    channelName: video.snippet.channelTitle,
    thumbnails: video.snippet.thumbnails,
    description: video.snippet.description || '',
    publishedAt: video.snippet.publishedAt
      ? new Date(video.snippet.publishedAt)
      : new Date(),
    duration,
  }
}

/**
 * Convierte duración ISO 8601 (PT4M13S) a formato MM:SS
 * @param {string} isoDuration - Duración en formato ISO 8601
 * @returns {string} - Duración en formato MM:SS
 */
function formatDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)

  if (!match) return '0:00'

  const hours = parseInt(match[1]) || 0
  const minutes = parseInt(match[2]) || 0
  const seconds = parseInt(match[3]) || 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export async function searchYouTube(query, maxResults = 8) {
  console.log(
    '🎬 YouTube API: Searching for:',
    query,
    'with API key:',
    API_KEY ? 'Present' : 'Missing',
  )

  if (!API_KEY) {
    throw new Error('YouTube API Key no configurada')
  }

  const url = `${BASE_URL}?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(
    query,
  )}&key=${API_KEY}`

  console.log(
    '🔗 YouTube API: Request URL (without key):',
    url.replace(API_KEY, '[HIDDEN]'),
  )

  const response = await fetch(url)

  console.log(
    '📡 YouTube API: Response status:',
    response.status,
    response.statusText,
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ YouTube API Error:', errorText)
    throw new Error(`YouTube API Error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  console.log(
    '✅ YouTube API: Raw response items count:',
    data.items?.length || 0,
  )

  // Mapea los resultados a un formato más simple
  const results = data.items.map((item) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    thumbnails: item.snippet.thumbnails
      ? Object.values(item.snippet.thumbnails)
      : [],
    description: item.snippet.description || '',
    publishedAt: item.snippet.publishedAt
      ? new Date(item.snippet.publishedAt)
      : new Date(),
  }))

  console.log('🎯 YouTube API: Formatted results:', results.length)
  return results
}
