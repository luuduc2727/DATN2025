import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs" 
import jwt from "jsonwebtoken"
export const register = async (req, res, next) => {
    try {
        const {fullname, email, phoneNumber, password, role } = req.body;
        if(!fullname || !email || !phoneNumber || !password || ! role) {
            return res.status(400).json(
               { message:"missing any value",
                success: false}
            )
           
        };
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"email was existed",
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            message:"Account created",
            success: true
        })
    } catch (err) {
        console.log(console.err)
    }
}

export const login = async (req, res) => {
    try{
        const {email, password, role} = req.body
        if(!email || !password || ! role) {
            return res.status(400).json(
               { message:"missing any value",
                success: false}
            )
        };
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"not found email",
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "password is not correct",
                success: false
            })
        }
        // check role
        if(role !== user.role){
            return res.status(400).json({
                message:"Account doesn't exist with current role",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY,{expiresIn:'1d'});

        user = {
            _id:user._id,
            fullname:user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpsOnly:true, sameSite:'strict'}).json({
            message: `Welcome back, user ${user.fullname}`,
            success: true,
            user
        })
    } catch(err){
        console.log(err)
    }
} 

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message: "loggout successfully",
            success: true
        })
    } catch(err) {
        console.log(err)
    }
}
export const updateProfile = async (req, res) => {
    try{
        const {fullname, email, phoneNumber, bio, skills} = req.body;
        const file = req.file;

        // cloudinary 
        let skillsArray
        if(skills){
            skillsArray = skills.split(", ");
        }
        const userId = req.id; //middleware authentication
        let user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message:"user not found",
                success: false
            })
        };

        //Update data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber) user.phoneNumber = phoneNumber
        if(bio) user.bio = bio
        if(skills) user.profile.skills  = skillsArray


        //resume comes later here...
        
        await user.save();

        
        user = {
            _id:user._id,
            fullname:user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true
        })
    } catch (err) {
        console.log(err)
    }
}