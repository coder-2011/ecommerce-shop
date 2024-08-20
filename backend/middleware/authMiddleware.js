import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js"
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
    let token;

    //Read JWT from the cookie.
    token = req.cookies.jwt;

    if(token) {
        try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
        next();
    } catch {
        throw new Error("Not authorized, authentication failed");
    }
    }else{
        res.status(401);
        throw new Error('Not authorized, no token');
    }

});

const admin = asyncHandler(async (req, res, next) => {
    if(req.user&& req.user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error("User not verified as admin")
    }
});

export {protect, admin};