import bannerModel from "../models/bannerModel.js";
import { v2 as cloudinary } from "cloudinary";

const addBanner = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.files || !req.files.image || req.files.image.length === 0) {
      return res.status(400).json({ success: false, message: "No images provided" });
    }

    const images = req.files.image.filter((file) => file !== undefined);

    // Upload each image to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {resource_type: "image",});
        return result.secure_url;
      })
    );

    // Construct banner data
    const bannerData = {
      title,
      description,
      image: imagesUrl,
      date: Date.now(),
    };

    console.log("Banner Data:", bannerData);

    // Save banner to the database
    const banner = new bannerModel(bannerData);
    await banner.save();

    res.status(201).json({ success: true, message: "Banner Added", data: banner });
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const listBanner = async (req, res) => {
  try {
    const banners = await bannerModel.find({});
    res.json({ success: true, banners });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeBanner = async (req, res) => {
    try {
        await bannerModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Banner Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
};

export { addBanner, listBanner, removeBanner };
