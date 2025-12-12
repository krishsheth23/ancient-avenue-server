import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: Array, required: true },
  date: { type: Date, default: Date.now() },
});

const bannerModel = mongoose.models.banner || mongoose.model("banner", bannerSchema);

export default bannerModel;