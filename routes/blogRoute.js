import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';
import { addblog, listblogs, removeblog } from '../controllers/blogController.js';

const blogRouter = express.Router();

blogRouter.post('/add', adminAuth, upload.fields([{ name: 'thumbnail', maxCount: 1 }]), addblog);
blogRouter.get('/list', listblogs);
blogRouter.post('/remove', adminAuth, removeblog);

export default blogRouter