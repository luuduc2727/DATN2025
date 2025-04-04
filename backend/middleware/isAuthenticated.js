import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // nhớ import đúng

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decoded.userId); // lấy full user

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        req.user = user;       // ✅ Gán cả user
        req.id = user._id;     // ✅ Gán ID riêng nếu cần
        next();

    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
};

export default isAuthenticated;
