import express from 'express';
import { addBanner, listBanner, removeBanner } from '../controllers/bannerController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const bannerRouter = express.Router();

bannerRouter.post('/add-banner', adminAuth, upload.fields([{name:'image', maxCount:1}]),addBanner);
bannerRouter.get('/list-banner', listBanner);
bannerRouter.post('/remove-banner', adminAuth, removeBanner);

export default bannerRouter