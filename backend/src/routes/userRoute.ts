import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import prisma from '../config/db.js';
import { createUserSchema, validateUserSchema } from '../zodType.js';

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

        return res.status(403).json({ error: "Server Problem!", success: false })
    }
})


export default userRoute