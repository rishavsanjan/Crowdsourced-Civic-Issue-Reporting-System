import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import prisma from '../config/db';
import { validateAdminSchema } from '../zodType';
import authMid from '../middlewares/userAuth';
import { success } from 'zod';
import { Twilio } from "twilio";
import fetch from "node-fetch";

import dotenv from 'dotenv';
import workerRoute from './workerRoute';
dotenv.config();

const adminRoute = express.Router();


const client = new Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

async function SendPushNotification(expoPushToken: string, title: string, body: string, data: number | undefined) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data,
    }

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });

        const result = await response.json();
        console.log("Expo push result:", result);
    } catch (error) {
        console.error("Error sending push:", error);
    }
}



adminRoute.post('/login', async (req, res) => {

    const p = validateAdminSchema.safeParse(req.body);
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: p.data.email }
        })

        if (!user) {
            return res.status(200).json({ error: "Wrong phone number!", success: false })
        }

        //const match = await bcrypt.compare(p.data.password, user.password);
        const match = await p.data.password === user.password;
        if (!match) {
            return res.status(200).json({ error: "Wrong password!", success: false })
        }

        const token = jwt.sign({ user_id: user.id, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET!)
        return res.status(200).json({ msg: token, success: true })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

adminRoute.get('/admin-home', async (req, res) => {
    try {
        //@ts-ignore
        const complaints = await prisma.complaint.findMany({
            include: {
                media: true,

            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        const countComplaints = {
            resloved: 0,
            pending: 0,
            in_progress: 0
        }

        complaints.map((complain) => {
            if (complain.status === 'in_progress') {
                countComplaints.in_progress++;
            } else if (complain.status === 'pending') {
                countComplaints.pending++;
            } else {
                countComplaints.resloved++;
            }
        })

        return res.status(200).json({ success: true, complaints, countComplaints });
    } catch (error) {

        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

adminRoute.get('/details/:complaint_id', async (req, res) => {
    try {
        console.log('hello')
        let { complaint_id }: any = req.params;
        complaint_id = parseInt(complaint_id);
        let complaint = await prisma.complaint.findUnique({
            where: {
                complaint_id
            },
            include: {
                media: true,
                user: true,
                AdminstrativeComments: true,
                worker: true,
                workAssigneds:true
            }
        })

        let availableWorker;
        if (!complaint?.workerId) {
            availableWorker = await prisma.worker.findMany({
                select: {
                    id: true,
                    name: true
                }
            })
        }



        return res.status(200).json({ success: true, complaint, availableWorker });
    } catch (error) {

        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

adminRoute.post('/add-comment', authMid, async (req, res) => {
    try {

        //@ts-ignore
        const userId = req.user.user_id;
        let { comment, commentType, complaint_id } = req.body;
        complaint_id = parseInt(complaint_id)

        const addComment = await prisma.adminstrativeComments.create({
            data: {
                comment, type: commentType, complaint_id
            },
            select: {
                comment: true,
                type: true,
                id: true,
                createdAt: true
            }
        })
        return res.status(200).json({ success: true, addComment });
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

adminRoute.post('/update-status', authMid, async (req, res) => {
    try {
        console.log('i m er')
        //@ts-ignore
        const userId = req.user.user_id;

        let { newStatus, complaint_id } = req.body;
        complaint_id = parseInt(complaint_id);

        const complaint = await prisma.complaint.findUnique({
            where: {
                complaint_id
            },
            include: {
                user: true
            }
        })

        const updateStatus = await prisma.complaint.update({
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
        })
        const user = await prisma.user.findUnique({ where: { id: complaint?.user.id } });

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
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

adminRoute.get('/admin-dashboard', async (req, res) => {
    try {

        //pie chart for complaint status
        const complaints = await prisma.complaint.findMany({
            include: {
                media: true,

            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        const countComplaints = {
            resloved: 0,
            pending: 0,
            in_progress: 0
        }

        complaints.map((complain) => {
            if (complain.status === 'in_progress') {
                countComplaints.in_progress++;
            } else if (complain.status === 'pending') {
                countComplaints.pending++;
            } else {
                countComplaints.resloved++;
            }
        })

        //line chart : complaints over time

        const result = await prisma.complaint.groupBy({
            by: 'createdAt',
            _count: { complaint_id: true }
        })

        const monthlyData: Record<string, number> = {}
        result.forEach((item) => {
            const month = new Date(item.createdAt).toLocaleString("default", {
                month: "short",
                year: "numeric",
            });
            monthlyData[month] = (monthlyData[month] || 0) + item._count.complaint_id;
        });

        return res.status(200).json({ success: true, complaints, countComplaints, monthlyData });

    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

adminRoute.post('/assign-worker', authMid, async (req, res) => {
    try {
        const { workerId, complaint_id } = req.body;
        const worker = await prisma.workAssigned.create({
            data: {
                complaint_id: parseInt(complaint_id),
                worker_id: workerId,
                status: 'pending',
            },
        })

        const update = await prisma.complaint.update({
            where: {
                complaint_id: parseInt(complaint_id),
            },
            data: {
                workerId: workerId
            }
        })



        return res.status(200).json({ success: true, worker });

    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problemd!", success: false })
    }
})

export default adminRoute;