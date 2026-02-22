"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const zodType_1 = require("../zodType");
const userAuth_1 = __importDefault(require("../middlewares/userAuth"));
const twilio_1 = require("twilio");
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adminRoute = express_1.default.Router();
const client = new twilio_1.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
async function SendPushNotification(expoPushToken, title, body, data) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data,
    };
    try {
        const response = await (0, node_fetch_1.default)('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
        const result = await response.json();
        console.log("Expo push result:", result);
    }
    catch (error) {
        console.error("Error sending push:", error);
    }
}
adminRoute.post('/login', async (req, res) => {
    const p = zodType_1.validateAdminSchema.safeParse(req.body);
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false });
    }
    try {
        const user = await db_1.default.user.findUnique({
            where: { email: p.data.email }
        });
        if (!user) {
            return res.status(200).json({ error: "Wrong phone number!", success: false });
        }
        //const match = await bcrypt.compare(p.data.password, user.password);
        const match = await p.data.password === user.password;
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
adminRoute.get('/admin-home', async (req, res) => {
    try {
        //@ts-ignore
        const complaints = await db_1.default.complaint.findMany({
            include: {
                media: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        const countComplaints = {
            resloved: 0,
            pending: 0,
            in_progress: 0
        };
        complaints.map((complain) => {
            if (complain.status === 'in_progress') {
                countComplaints.in_progress++;
            }
            else if (complain.status === 'pending') {
                countComplaints.pending++;
            }
            else {
                countComplaints.resloved++;
            }
        });
        return res.status(200).json({ success: true, complaints, countComplaints });
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
        let complaint = await db_1.default.complaint.findUnique({
            where: {
                complaint_id
            },
            include: {
                media: true,
                user: true,
                AdminstrativeComments: true,
                worker: true
            }
        });
        let availableWorker;
        if (!(complaint === null || complaint === void 0 ? void 0 : complaint.workerId)) {
            availableWorker = await db_1.default.worker.findMany({
                select: {
                    id: true,
                    name: true
                }
            });
        }
        return res.status(200).json({ success: true, complaint, availableWorker });
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
            },
            select: {
                comment: true,
                type: true,
                id: true,
                createdAt: true
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
        console.log('i m er');
        //@ts-ignore
        const userId = req.user.user_id;
        let { newStatus, complaint_id } = req.body;
        complaint_id = parseInt(complaint_id);
        const complaint = await db_1.default.complaint.findUnique({
            where: {
                complaint_id
            },
            include: {
                user: true
            }
        });
        const updateStatus = await db_1.default.complaint.update({
            where: {
                complaint_id
            },
            data: {
                status: newStatus
            },
            select: {
                complaint_id: true,
                status: true
            }
        });
        const user = await db_1.default.user.findUnique({ where: { id: complaint === null || complaint === void 0 ? void 0 : complaint.user.id } });
        // if (user?.expoPushToken) {
        //     await SendPushNotification(
        //         user.expoPushToken,
        //         "Complaint Status Updated ✅",
        //         `Your status is changed to  ${newStatus}. Please log in the app to check the new status of your report.`,
        //         complaint?.complaint_id
        //     );
        // }
        // try {
        //     const message = await client.messages.create({
        //         body: `Your status is changed to  ${newStatus}. Please log in the app to check the new status of your report.`,
        //         messagingServiceSid: process.env.messagingServiceSid,
        //         //@ts-ignore
        //         to: `+91${complaint?.user.phonenumber}`
        //     });
        //     console.log("OTP sent successfully:", message.sid, ` ${newStatus}`);
        // } catch (error) {
        //     console.log("Error sending OTP:", error);
        // }
        return res.status(200).json({ success: true, updateStatus });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
adminRoute.get('/admin-dashboard', async (req, res) => {
    try {
        //pie chart for complaint status
        const complaints = await db_1.default.complaint.findMany({
            include: {
                media: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        const countComplaints = {
            resloved: 0,
            pending: 0,
            in_progress: 0
        };
        complaints.map((complain) => {
            if (complain.status === 'in_progress') {
                countComplaints.in_progress++;
            }
            else if (complain.status === 'pending') {
                countComplaints.pending++;
            }
            else {
                countComplaints.resloved++;
            }
        });
        //line chart : complaints over time
        const result = await db_1.default.complaint.groupBy({
            by: 'createdAt',
            _count: { complaint_id: true }
        });
        const monthlyData = {};
        result.forEach((item) => {
            const month = new Date(item.createdAt).toLocaleString("default", {
                month: "short",
                year: "numeric",
            });
            monthlyData[month] = (monthlyData[month] || 0) + item._count.complaint_id;
        });
        return res.status(200).json({ success: true, complaints, countComplaints, monthlyData });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
adminRoute.post('/assign-worker', userAuth_1.default, async (req, res) => {
    console.log('i m hit');
    try {
        const { workerId, complaint_id } = req.body();
        console.log('i mhere    ');
        const worker = await db_1.default.workAssigned.create({
            data: {
                complaint_id: complaint_id,
                worker_id: workerId,
                status: 'pending',
            },
        });
        return res.status(200).json({ success: true, worker });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problemd!", success: false });
    }
});
adminRoute.get('/a', async (req, res) => {
    console.log('i m hit');
});
exports.default = adminRoute;
