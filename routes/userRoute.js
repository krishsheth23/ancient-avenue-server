import express from 'express';
import { loginUser, adminLogin, registerUser, allUsers, removeUser, updateProfile, getProfile } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/allusers',adminAuth, allUsers)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.get("/get-profile", authUser, getProfile)
userRouter.delete('/removeuser/:id', adminAuth, removeUser)

export default userRouter;