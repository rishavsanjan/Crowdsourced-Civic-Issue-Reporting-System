"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const zodType_1 = require("../zodType");
const userAuth_1 = __importDefault(require("../middlewares/userAuth"));
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')('ACda1eb41cb2a30553cc66f0178fbcd950', "2eb628697e455772e7dce4cbee7aa22e");
const userRoute = express_1.default.Router();
async function checkActiveReporterBadge(userId) {
    const complaintCount = await db_1.default.complaint.count({
        where: { user_id: userId },
    });
    const activeReporterBadge = await db_1.default.badgeType.findUnique({
        where: { name: "Active Reporter" },
    });
    const existingBadge = await db_1.default.userBadge.findFirst({
        where: {
            user_id: userId,
            badge_id: activeReporterBadge === null || activeReporterBadge === void 0 ? void 0 : activeReporterBadge.id,
        },
    });
    if (complaintCount >= 5 && !existingBadge) {
        await db_1.default.userBadge.create({
            data: {
                user_id: userId,
                badge_id: activeReporterBadge.id,
            },
        });
        console.log("🏅 Awarded 'Active Reporter' badge to user", userId);
    }
}
userRoute.post('/signup-no-otp', async (req, res) => {
    console.log('hello');
    const { phone } = await req.body;
    const user = await db_1.default.user.findUnique({
        where: { phonenumber: phone }
    });
    if (user) {
        return res.status(200).json({ error: "Number already registered!", success: false });
    }
    let digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    try {
        const message = await client.messages.create({
            body: `Your verification code is ${OTP}`,
            messagingServiceSid: process.env.messagingServiceSid,
            to: `+91${phone}`
        });
        console.log("OTP sent successfully:", message.sid, ` ${OTP}`);
        return res.status(200).json({ msg: 'success', otp: OTP });
    }
    catch (error) {
        console.log("Error sending OTP:", error);
    }
});
userRoute.post('/signup-final', async (req, res) => {
    const p = zodType_1.createUserSchema.safeParse(req.body);
    const { name, email, password, phonenumber } = await req.body;
    try {
        const hpass = await bcryptjs_1.default.hash(password, 10);
        const user = await db_1.default.user.create({
            data: {
                email,
                name,
                password: hpass,
                phonenumber
            }
        });
        return res.status(200).json({ msg: 'success', success: true, user: user });
    }
    catch (error) {
        console.log(error);
    }
});
userRoute.post('/login-password', async (req, res) => {
    console.log('i m hit');
    const p = zodType_1.validateUserSchema.safeParse(req.body);
    console.log(p);
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false });
    }
    try {
        const user = await db_1.default.user.findUnique({
            where: { phonenumber: p.data.phonenumber }
        });
        if (!user) {
            return res.status(200).json({ error: "Wrong phone number!", success: false });
        }
        const match = await bcryptjs_1.default.compare(p.data.password, user.password);
        if (!match) {
            return res.status(200).json({ error: "Wrong password!", success: false });
        }
        const token = jsonwebtoken_1.default.sign({ user_id: user.id, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET);
        return res.status(200).json({ msg: token, success: true });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
userRoute.post('/confirm-login-otp', async (req, res) => {
    try {
        const { phonenumber } = req.body;
        const user = await db_1.default.user.findUnique({
            where: { phonenumber }
        });
        if (!user) {
            return res.status(200).json({ error: "Wrong phone number!", success: false });
        }
        const token = jsonwebtoken_1.default.sign({ user_id: user.id, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET);
        return res.status(200).json({ msg: token, success: true });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
userRoute.post('/login-otp', async (req, res) => {
    const { phone } = await req.body;
    const user = await db_1.default.user.findUnique({
        where: { phonenumber: phone }
    });
    if (!user) {
        return res.status(200).json({ error: "Number not registered!", success: false });
    }
    let digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    try {
        const message = await client.messages.create({
            body: `Your verification code is ${OTP}`,
            messagingServiceSid: process.env.messagingServiceSid,
            to: `+91${phone}`
        });
        console.log("OTP sent successfully:", message.sid, ` ${OTP}`);
        return res.status(200).json({ msg: 'success', otp: OTP });
    }
    catch (error) {
        console.log("Error sending OTP:", error);
    }
});
userRoute.post('/login-no-otp', async (req, res) => {
    const p = zodType_1.validateUserSchema.safeParse(req.body);
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false });
    }
    const user = await db_1.default.user.findUnique({
        where: { email: p.data.phonenumber }
    });
    if (!user) {
        return res.status(200).json({ error: "Mobile not registered yet!", success: false });
    }
    let digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    try {
        const message = await client.messages.create({
            body: `Your verification code is ${OTP}`,
            messagingServiceSid: process.env.messagingServiceSid, // ✅ Correct property
            to: "+917051901216"
        });
        console.log("OTP sent successfully:", message.sid, ` ${OTP}`);
    }
    catch (error) {
        console.log("Error sending OTP:", error);
    }
});
userRoute.get('/profile', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const user = await db_1.default.user.findUnique({
            where: {
                id: userId
            },
            select: {
                name: true,
                createdAt: true,
                email: true,
                Complaint: true,
                UserBadge: true
            }
        });
        const resolvedReports = await db_1.default.complaint.findMany({
            where: {
                user_id: userId,
                status: 'resolved'
            }
        });
        console.log(resolvedReports);
        return res.status(200).json({ msg: 'success', success: true, user: user, resolvedReports: resolvedReports });
    }
    catch (error) {
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
userRoute.get('/badges', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        let badges = await db_1.default.badgeType.findMany({});
        const userBadges = await db_1.default.userBadge.findMany({});
        const complaints = await db_1.default.complaint.count({
            where: { user_id: userId }
        });
        const userVotes = await db_1.default.vote.count({
            where: { user_id: userId, vote_type: 'like' }
        });
        const votes = await db_1.default.vote.count({
            where: {
                complaint: { user_id: userId }
            }
        });
        badges = badges.map((badge) => {
            if (badge.id === 1) {
                return {
                    ...badge,
                    current: complaints,
                    goal: 5
                };
            }
            if (badge.id === 2) {
                return {
                    ...badge,
                    current: votes,
                    goal: 100
                };
            }
            if (badge.id === 3) {
                return {
                    ...badge,
                    current: userVotes,
                    goal: 50
                };
            }
            return badge;
        });
        return res.status(200).json({ msg: 'success', success: true, badges: badges });
    }
    catch (error) {
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
// In your complaint creation route (e.g., /api/user/addcomplain)
userRoute.post('/addcomplain', userAuth_1.default, async (req, res) => {
    try {
        console.log(req.body);
        const { category, title, description, latitude, longitude, address, media // This will be an array of media objects
         } = req.body;
        //@ts-ignore
        const userId = req.user.user_id; // From authentication middleware
        checkActiveReporterBadge(userId);
        // Create complaint with media in a transaction
        const result = await db_1.default.$transaction(async (prisma) => {
            // Create the complaint first
            const complaint = await prisma.complaint.create({
                data: {
                    user_id: userId,
                    category: category,
                    title: title,
                    description: description,
                    latitude: latitude,
                    longitude: longitude,
                    address: address,
                    status: 'pending'
                }
            });
            // Create media entries if any media was uploaded
            if (media && media.length > 0) { //@ts-ignore
                const mediaData = media.map(item => ({
                    complaint_id: complaint.complaint_id,
                    file_url: item.url,
                    file_type: item.type === 'photo' ? 'image' : 'video'
                }));
                await prisma.media.createMany({
                    data: mediaData
                });
            }
            return complaint;
        });
        res.json({
            success: true,
            message: 'Complaint created successfully',
            complaint: result
        });
    }
    catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create complaint', //@ts-ignore
            error: error.message
        });
    }
});
userRoute.get('/allcomplain', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id; // From authentication middleware
        const complaint = await db_1.default.complaint.findMany({
            where: {
                user_id: userId
            }
        });
        return res.status(200).json({ success: true, msg: 'success', complaint: complaint });
    }
    catch (error) {
        console.error('Error creating complaint:', error);
    }
});
exports.default = userRoute;
