import express from 'express'
import bcrypt, { compare } from 'bcryptjs';
import jwt from "jsonwebtoken";
import prisma from '../config/db';
import authMid from '../middlewares/userAuth';


const workerRoute = express.Router();

workerRoute.post('/login', async (req, res) => {
    try {
        const { phone, password } = await req.body;

        const worker = await prisma.worker.findUnique({
            where: {
                phoneNumber: phone
            }
        })
        if (!worker) {
            return res.status(401).json({ message: "Wrong number!", success: false })
        }
        const match = await bcrypt.compare(password, worker.password);
        if (!match) {
            return res.status(200).json({ error: "Wrong password!", success: false })
        }
        const token = jwt.sign({ user_id: worker.id, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET!)
        return res.status(200).json({ msg: token, success: true })

    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
})

export default workerRoute