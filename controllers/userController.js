import validator from "validator";
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js"


const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req,res) => {
    try {
        
        const { email, password } = req.body;

        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false, message:"User doesn't exists"})
        }

        const isMatch = await bcryptjs.compare(password,user.password);

        if (isMatch) {
            
            const token = createToken(user._id)
            res.json({success:true, token})

        }
        else{
            res.json({success:false, message:'Invalid credentials'})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}

// All Users Data for Admin Panel
const allUsers = async (req, res) => {
        try {
            const users = await userModel.find({});
            res.json({ success: true, users });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    };

// Remove User from Admin Panel and DB
const removeUser = async (req, res) => {
    try {
        // Access the user ID from URL parameters
        await userModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User Removed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for user register
const registerUser = async (req,res) => {
    try {
        
        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.json({success:false, message:"User already exists"})
        }

        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter a valid email"})
        }
        if (password.length < 8) {
            return res.json({success:false, message:"Please enter a strong password"})
        }

        // Hashing user password
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)

        const newUser = new userModel({
            name,
            email,
            password:hashPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}

// Route for admin login
const adminLogin = async (req,res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        }  
        else {
            res.json({success:false,message:"Invalid credientials"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message}) 
    }
}

const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { loginUser,registerUser,adminLogin, allUsers, removeUser, updateProfile, getProfile }