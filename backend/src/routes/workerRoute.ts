import express from 'express'
import bcrypt, { compare } from 'bcryptjs';
import jwt from "jsonwebtoken";
import prisma from '../config/db';
import authMid from '../middlewares/userAuth';


const workerRoute = express.Router();

workerRoute.post('/login', async (req, res) => {
    try {
        const { number, password } = await req.body;

        const worker = await prisma.worker.findUnique({
            where: {
                phoneNumber: number
            }
        })
        if (!worker) {
            return res.status(401).json({ message: "Wrong number!", success: false })
        }
        // const match = await bcrypt.compare(password, worker.password);
        const match = password === worker.password
        console.log(password, worker.password)
        if (!match) {
            return res.status(401).json({ error: "Wrong password!", success: false })
        }
        const token = jwt.sign({ user_id: worker.id, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET!)
        return res.status(200).json({ msg: token, success: true })

    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
})

workerRoute.get('/isValid', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const user = await prisma.worker.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                phoneNumber: true
            }
        })
        return res.status(200).json({ msg: 'success', success: true, user: user })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
})

workerRoute.post('/update-work', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { workId } = req.body();

        const updateWork = await prisma.workAssigned.update({
            where: {
                id: workId
            },
            data: {
                status: 'completed'
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
})


export default workerRoute