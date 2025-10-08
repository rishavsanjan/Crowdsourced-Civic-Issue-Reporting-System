"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const userAuth_1 = __importDefault(require("../middlewares/userAuth"));
const adminRoute = express_1.default.Router();
const client = require('twilio')('ACda1eb41cb2a30553cc66f0178fbcd950', "2eb628697e455772e7dce4cbee7aa22e");
adminRoute.get('/admin-home', async (req, res) => {
    try {
        //@ts-ignore
        const complaints = await db_1.default.complaint.findMany({
            include: {
                media: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        return res.status(200).json({ success: true, complaints });
    }
    catch (error) {
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
adminRoute.get('/details/:complaint_id', async (req, res) => {
    try {
        console.log('hello');
        let { complaint_id } = req.params;
        complaint_id = parseInt(complaint_id);
        const complaint = await db_1.default.complaint.findUnique({
            where: {
                complaint_id
            },
            include: {
                media: true,
                user: true,
                AdminstrativeComments: true
            }
        });
        return res.status(200).json({ success: true, complaint });
    }
    catch (error) {
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
adminRoute.post('/add-comment', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        let { comment, commentType, complaint_id } = req.body;
        complaint_id = parseInt(complaint_id);
        const addComment = await db_1.default.adminstrativeComments.create({
            data: {
                comment, type: commentType, complaint_id
            }
        });
        return res.status(200).json({ success: true, addComment });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
adminRoute.post('/update-status', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        let { newStatus, complaint_id } = req.body;
        complaint_id = parseInt(complaint_id);
        const complaint = await db_1.default.complaint.findUnique({
            where: {
                complaint_id
            },
            select: {
                user: true
            }
        });
        const updateStatus = await db_1.default.complaint.update({
            where: {
                complaint_id
            },
            data: {
                status: newStatus
            }
        });
        try {
            const message = await client.messages.create({
                body: `Your status is changed to  ${newStatus}. Please log in the app to check the new status of your report.`,
                messagingServiceSid: process.env.messagingServiceSid,
                //@ts-ignore
                to: `+91${complaint === null || complaint === void 0 ? void 0 : complaint.user.phonenumber}`
            });
            console.log("OTP sent successfully:", message.sid, ` ${newStatus}`);
        }
        catch (error) {
            console.log("Error sending OTP:", error);
        }
        return res.status(200).json({ success: true, updateStatus });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
exports.default = adminRoute;
