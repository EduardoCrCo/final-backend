import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  videoTitle: {
    type: String,
    required: true,
  },
  videoThumbnail: {
    type: String,
  },
  channelName: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },
  tags: [
    {
      type: String,
      maxlength: 30,
    },
  ],
  isPublic: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Índice compuesto para evitar reviews duplicadas del mismo usuario para el mismo video
reviewSchema.index({ userId: 1, videoId: 1 }, { unique: true })

// Middleware para actualizar updatedAt en cada modificación
reviewSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() })
})

export default mongoose.model('Review', reviewSchema)
