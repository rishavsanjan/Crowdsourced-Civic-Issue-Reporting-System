import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import prisma from '../config/db';
import { createUserSchema, vadlidateComplainSchema, validateUserSchema } from '../zodType';
import authMid from '../middlewares/userAuth';
import { success } from 'zod';
import { Twilio } from "twilio";

import dotenv from 'dotenv';
dotenv.config();

const adminRoute = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

adminRoute.get('/admin-home', async (req, res) => {
    try {
        //@ts-ignore
        const complaints = await prisma.complaint.findMany({
            include: {
                media: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
        return res.status(200).json({ success: true, complaints });
    } catch (error) {

        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

adminRoute.get('/details/:complaint_id', async (req, res) => {
    try {
        console.log('hello')
        let { complaint_id }: any = req.params;
        complaint_id = parseInt(complaint_id);
        const complaint = await prisma.complaint.findUnique({
            where: {
                complaint_id
            },
            include: {
                media: true,
                user: true,
                AdminstrativeComments: true
            }
        })
        return res.status(200).json({ success: true, complaint });
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

        //@ts-ignore
        const userId = req.user.user_id;

        let { newStatus, complaint_id } = req.body;
        complaint_id = parseInt(complaint_id);

        const complaint = await prisma.complaint.findUnique({
            where: {
                complaint_id
            },
            select: {
                user: true
            }
        })

        const updateStatus = await prisma.complaint.update({
            where: {
                complaint_id
            },
            data: {
                status: newStatus
            }
        })
        try {
            const message = await client.messages.create({
                body: `Your status is changed to  ${newStatus}. Please log in the app to check the new status of your report.`,
                messagingServiceSid: process.env.messagingServiceSid,
                //@ts-ignore
                to: `+91${complaint?.user.phonenumber}`
            });
            console.log("OTP sent successfully:", message.sid, ` ${newStatus}`);
        } catch (error) {
            console.log("Error sending OTP:", error);
        }
        return res.status(200).json({ success: true, updateStatus });
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

export default adminRoute