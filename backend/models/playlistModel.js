import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  videos: [
    {
      youtubeId: String,
      title: String,
      description: String,
      thumbnails: Object,
      channelTitle: String,
      publishedAt: Date,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Playlist", playlistSchema);
