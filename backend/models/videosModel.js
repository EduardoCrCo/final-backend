import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    youtubeId: { type: String, required: true, index: true },

    title: String,
    description: String,

    thumbnails: {
      default: String,
      medium: String,
      high: String,
    },

    channelTitle: String,
    publishedAt: Date,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    likesCount: { type: Number, default: 0 },
    savesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
