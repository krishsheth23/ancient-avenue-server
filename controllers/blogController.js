import { v2 as cloudinary } from "cloudinary"
import blogModel from '../models/blogModel.js'


const addblog = async (req, res) => {
    try {
        const { title, description, author } = req.body;

        // Use `req.files.thumbnail` as specified in the router
        const image = req.files.thumbnail && req.files.thumbnail[0];

        // Ensure `image` is defined before proceeding
        if (!image) {
            return res.json({ success: false, message: "No image provided" });
        }
        
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
        const imageUrl = result.secure_url;

        // Construct the blog data with the Cloudinary image URL
        const blogData = {
            title,
            description,
            author,
            image: imageUrl,  // Use the single image URL
            date: Date.now()
        };

        console.log(blogData);

        const blog = new blogModel(blogData);
        await blog.save();

        res.json({ success: true, message: "Blog Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


const listblogs = async(req,res) => {
    try {
        const blogs = await blogModel.find({});
        res.json({success:true,blogs})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

const removeblog = async(req,res) => {
    try {
        await blogModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Blog Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export {addblog,listblogs,removeblog}