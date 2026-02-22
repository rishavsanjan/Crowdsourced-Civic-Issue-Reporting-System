"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//@ts-ignore
const authMid = (req, res, next) => {
    const head = req.headers.authorization;
    if (!head || !head.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "Authorization token missing", success: false });
    }
    const token = head.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ msg: "Invalid or expired token", success: false });
    }
};
exports.default = authMid;
