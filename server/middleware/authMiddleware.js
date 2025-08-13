import User from "../models/user.js";

// middleware to check if user is authenticated 
export const protect = async (req, res, next) => { 
    const { userId } = req.auth;
    if (!userId) {
        res.json({success: false, message:"unauthorised"})
    }
    else {
        const user = await User.findById(userId);
        req.user = user;
        next()
    }
}