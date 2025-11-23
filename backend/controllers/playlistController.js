import Playlist from '../models/playlistModel.js'

// Helper function para extraer videoId de thumbnails
const extractVideoId = (video) => {
  if (video.videoId) return video.videoId

  // Extraer de thumbnails si no tiene videoId directo
  if (video.thumbnails && video.thumbnails.length > 0) {
    const thumbnailUrl = video.thumbnails[0].url
    const match = thumbnailUrl.match(/\/vi\/([^/]+)\//)
    return match ? match[1] : null
  }

  return null
}

export const getUserPlaylists = async (req, res) => {
  const { userId } = req.user

  try {
    const playlists = await Playlist.find({ userId })
    res.json(playlists)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener playlists' })
  }
}

export const createPlaylist = async (req, res) => {
  const { name } = req.body
  const { userId } = req.user

  if (!name) return res.status(400).json({ message: 'Nombre requerido' })

  try {
    const playlist = await Playlist.create({ userId, name, videos: [] })
    res.status(201).json(playlist)
  } catch (err) {
    res.status(500).json({ message: 'Error creando la playlist' })
  }
}

export const deletePlaylist = async (req, res) => {
  const { id } = req.params
  const { userId } = req.user

  try {
    const playlist = await Playlist.findOneAndDelete({ _id: id, userId })

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' })
    }

    res.json({ message: 'Playlist eliminada correctamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando la playlist' })
  }
}

export const addVideoToPlaylist = async (req, res) => {
  const { id } = req.params
  const { userId } = req.user
  const video = req.body

  if (!video || !video.videoId) {
    return res.status(400).json({ message: 'Datos del video requeridos' })
  }

  try {
    const playlist = await Playlist.findOne({ _id: id, userId })

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' })
    }

    // Verificar si el video ya existe
    const newVideoId = extractVideoId(video)
    if (!newVideoId) {
      return res
        .status(400)
        .json({ message: 'No se pudo identificar el videoId' })
    }

    const videoExists = playlist.videos.some((v) => {
      const existingVideoId = extractVideoId(v)
      return existingVideoId === newVideoId
    })

    if (videoExists) {
      return res
        .status(400)
        .json({ message: 'El video ya está en la playlist' })
    }

    playlist.videos.push(video)
    await playlist.save()

    res.json({ message: 'Video agregado correctamente', playlist })
  } catch (err) {
    res.status(500).json({ message: 'Error agregando video a la playlist' })
  }
}

export const removeVideoFromPlaylist = async (req, res) => {
  const { id, videoId } = req.params
  const { userId } = req.user

  try {
    const playlist = await Playlist.findOne({ _id: id, userId })

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' })
    }

    playlist.videos = playlist.videos.filter((v) => {
      const existingVideoId = extractVideoId(v)
      return existingVideoId !== videoId
    })
    await playlist.save()

    res.json({ message: 'Video eliminado correctamente', playlist })
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando video de la playlist' })
  }
}
