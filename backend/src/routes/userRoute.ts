import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import prisma from '../config/db.js';
import { createUserSchema, vadlidateComplainSchema, validateUserSchema } from '../zodType.js';
import authMid from '../middlewares/userAuth.js';
import { success } from 'zod';

const userRoute = express.Router();

userRoute.post('/signup', async (req, res) => {

    const p = createUserSchema.safeParse(req.body);
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false })
    }
    const hpass = await bcrypt.hash(p.data.password, 10)
    try {
        const alreadyExists = await prisma.user.findUnique({
            where: {
                email: p.data.email
            }
        });

        if (alreadyExists) {
            return res.status(200).json({ "error": 'User already exists!' })
        }

        const user = await prisma.user.create({
            data: {
                name: p.data.name,
                email: p.data.email,
                password: hpass
            }
        })
        return res.json({ success: true, msg: "user created", user })
    } catch (error) {

        return res.status(403).json({ msg: "Either user alredy exist or there is a server problem", success: false })
    }
})


userRoute.post('/login', async (req, res) => {
    const p = validateUserSchema.safeParse(req.body);
    if (!p.success) {
        return res.status(400).json({ "msg": "Invalid format or less info", "success": false })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: p.data.email }
        })
        if (!user) {
            return res.status(200).json({ error: "Invalid email address!", success: false })
        }
        const match = await bcrypt.compare(p.data.password, user.password);
        if (!match) {
            return res.status(200).json({ error: "Wrong password!", success: false })
        }
        const token = jwt.sign({ user_id: user.id, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET!)
        return res.json({ msg: token, success: true, role: user })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});


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
                Complaint: true
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
            media // This will be an array of media objects
        } = req.body;
        //@ts-ignore
        const userId =  req.user.user_id; // From authentication middleware

        // Create complaint with media in a transaction
        const result = await prisma.$transaction(async (prisma) => {
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








export default userRoute