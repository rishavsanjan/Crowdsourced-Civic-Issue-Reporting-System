import express from 'express';
import bcrypt, { compare } from 'bcryptjs';
import jwt from "jsonwebtoken";
import prisma from '../config/db';
import { createUserSchema, vadlidateComplainSchema, validateUserSchema } from '../zodType';
import authMid from '../middlewares/userAuth';
import { success } from 'zod';
import { Twilio } from "twilio";
import dotenv from 'dotenv';
import axios from 'axios'

dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);


const userRoute = express.Router();

async function checkActiveReporterBadge(userId: number) {
    const complaintCount = await prisma.complaint.count({
        where: { user_id: userId },
    });

    const activeReporterBadge = await prisma.badgeType.findUnique({
        where: { name: "Active Reporter" },
    });

    const existingBadge = await prisma.userBadge.findFirst({
        where: {
            user_id: userId,
            badge_id: activeReporterBadge?.id,
        },
    });

    if (complaintCount >= 5 && !existingBadge) {
        await prisma.userBadge.create({
            data: {
                user_id: userId,
                badge_id: activeReporterBadge!.id,
            },
        });
        console.log("🏅 Awarded 'Active Reporter' badge to user", userId);
    }
}






userRoute.post('/signup-no-otp', async (req, res) => {

    const { phone } = await req.body;
    const user = await prisma.user.findUnique({
        where: { phonenumber: phone }
    })

    if (user) {
        return res.status(200).json({ error: "Number already registered!", success: false })
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
    } catch (error) {
        console.log("Error sending OTP:", error);
    }
});

userRoute.post('/signup-final', async (req, res) => {
    const p = createUserSchema.safeParse(req.body);
    const { name, email, password, phonenumber } = await req.body;
    try {
        const hpass = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hpass,
                phonenumber
            }
        })
        return res.status(200).json({ msg: 'success', success: true, user: user })

    } catch (error) {
        console.log(error);
    }
});

userRoute.post('/login-password', async (req, res) => {
    console.log('i m hit')
    const p = validateUserSchema.safeParse(req.body);
    console.log(p)
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { phonenumber: p.data.phonenumber }
        })

        if (!user) {
            return res.status(200).json({ error: "Wrong phone number!", success: false })
        }

        const match = await bcrypt.compare(p.data.password, user.password);
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

userRoute.post('/confirm-login-otp', async (req, res) => {


    try {
        const { phonenumber } = req.body;
        const user = await prisma.user.findUnique({
            where: { phonenumber }
        })

        if (!user) {
            return res.status(200).json({ error: "Wrong phone number!", success: false })
        }

        const token = jwt.sign({ user_id: user.id, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET!)
        return res.status(200).json({ msg: token, success: true })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

userRoute.post('/login-otp', async (req, res) => {

    const { phone } = await req.body;
    const user = await prisma.user.findUnique({
        where: { phonenumber: phone }
    })

    if (!user) {
        return res.status(200).json({ error: "Number not registered!", success: false })
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
    } catch (error) {
        console.log("Error sending OTP:", error);
    }
});


userRoute.post('/login-no-otp', async (req, res) => {
    const p = validateUserSchema.safeParse(req.body);
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false })
    }

    const user = await prisma.user.findUnique({
        where: { email: p.data.phonenumber }
    })

    if (!user) {
        return res.status(200).json({ error: "Mobile not registered yet!", success: false })
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
    } catch (error) {
        console.log("Error sending OTP:", error);
    }
});

userRoute.get('/isValid', authMid, async (req, res) => {
    //@ts-ignore
    const userId = req.user.user_id;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            phonenumber: true
        }
    })
    console.log('i m here')
    console.log(user)
    return res.status(200).json({ msg: 'success', success: true, user: user })

})


userRoute.get('/profile', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const user = await prisma.user.findUnique({
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

        const resolvedReports = await prisma.complaint.findMany({
            where: {
                user_id: userId,
                status: 'resolved'
            }
        })

        console.log(resolvedReports)

        return res.status(200).json({ msg: 'success', success: true, user: user, resolvedReports: resolvedReports })
    } catch (error) {

        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

userRoute.get('/badges', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        let badges = await prisma.badgeType.findMany({});

        const userBadges = await prisma.userBadge.findMany({});

        const complaints = await prisma.complaint.count({
            where: { user_id: userId }
        });

        const userVotes = await prisma.vote.count({
            where: { user_id: userId, vote_type: 'like' }
        })

        const votes = await prisma.vote.count({
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
                }
            }
            if (badge.id === 2) {
                return {
                    ...badge,
                    current: votes,
                    goal: 100
                }
            }
            if (badge.id === 3) {
                return {
                    ...badge,
                    current: userVotes,
                    goal: 50
                }
            }
            return badge;
        })


        return res.status(200).json({ msg: 'success', success: true, badges: badges })
    } catch (error) {

        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});




// In your complaint creation route (e.g., /api/user/addcomplain)
userRoute.post('/addcomplain', authMid, async (req, res) => {
    try {
        console.log(req.body)
        const {
            category,
            title,
            description,
            latitude,
            longitude,
            address,
            media
        } = req.body;
        //@ts-ignore
        const userId = req.user.user_id;
        const response = await axios({
            url: `http://127.0.0.1:8000/predict`,
            method: 'post',
            data: {
                complaint: description
            }
        })

        console.log(response.data)

        checkActiveReporterBadge(userId);
        const formattedDepartment = await response.data.predicted_department.toUpperCase().replace(/\s+/g, "_");


        // Create complaint with media in a transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Create the complaint first
            const complaint = await prisma.complaint.create({
                data: {
                    user_id: userId,
                    category: formattedDepartment || 'N/A',
                    title: title,
                    description: description,
                    latitude: latitude,
                    longitude: longitude,
                    address: address,
                    status: 'pending'
                }
            });

            // Create media entries if any media was uploaded
            if (media && media.length > 0) {//@ts-ignore
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

    } catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create complaint',//@ts-ignore
            error: error.message
        });
    }
});




userRoute.get('/allcomplain', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id; 
        const complaint = await prisma.complaint.findMany({
            where: {
                user_id: userId
            }
        })

        return res.status(200).json({ success: true, msg: 'success', complaint: complaint })
    } catch (error) {
        console.log(error)
        console.error('Error creating complaint:', error);

    }
});


userRoute.post('/chatbot-message', authMid, async (req, res) => {
    console.log('i m hit')
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        let { message } = req.body;
        message = message.toLowerCase();
        if (message === 'hi' || message === 'hello' || message === 'hey' || message === 'hii' || message === 'hiii') {
            return res.status(200).json({ success: true, msg: "Hey there, How may I help you today ?" })
        }

        if (message === 'complaint status') {
            const complaint = await prisma.complaint.findMany({
                where: {
                    user_id: userId
                }
            })
            return res.status(200).json({ success: true, msg: 'Here are all the complaints, Please choose the one whose status you want to know:', complaint: complaint })

        }


        return res.status(200).json({ success: false })
    } catch (error) {
        console.error('Error creating complaint:', error);

    }
});

userRoute.post('save-expo-token', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { pushToken } = req.body;

        if (!pushToken) {
            return res.status(404).json({ success: false, msg: 'Token is missing' })
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                expoPushToken: pushToken
            }
        })

        return res.status(201).json({ success: true, msg: 'Token added successfully' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: 'Server Error' })
    }
})







export default userRoute