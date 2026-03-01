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

workerRoute.get('/get-jobs', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const [jobs, total] = await Promise.all([
            prisma.complaint.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                where: {
                    workerId: userId,
                },
                include: {
                    workAssigneds: true
                }
            }),
            prisma.complaint.count({
                where: {
                    workerId: userId,
                },
            }),
        ]);

        const nextPage = skip + limit < total ? page + 1 : null;

        return res.status(200).json({
            success: true,
            jobs,
            nextPage,
            total,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Server Problem!",
            success: false,
        });
    }
});

workerRoute.get('/profile', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        const totalWorks = await prisma.workAssigned.count({
            where: {
                worker_id: userId
            }
        })

        const successWork = await prisma.workAssigned.count({
            where: {
                status: 'completed',
                worker_id: userId
            }
        })

        const final = { ...user, totalTasks: totalWorks, successRate: successWork }

        return res.status(200).json({ success: true, final })

    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
})

workerRoute.get('/job', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const id = Number(req.query.id);

        const job = await prisma.workAssigned.findUnique({
            where: {
                id
            },
            include: {
                worker: true,
                complaint: true
            }
        })

        return res.status(200).json({
            job, success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
})

workerRoute.post('/upload-job', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { jobId, media } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            await tx.workAssigned.update({
                where: {
                    id: jobId
                },
                data: {
                    status: 'completed',
                }
            })
            if (media && media.length > 0) {
                const mediaData = media.map((item: any) => ({
                    workId: jobId,
                    file_url: item.file_url,
                    file_type: item.file_type === 'photo' ? 'image' : 'video'
                }));

                await tx.jobEvidence.createMany({
                    data: mediaData
                })
            }


        })
        return res.status(200).json({ success: true, result })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
})

workerRoute.post('/update-instructions', async (req, res) => {
    try {

        let { instructions, workId } = req.body;
        workId = Number(workId);
        const updateWork = await prisma.workAssigned.update({
            where: {
                id: workId
            },
            data: {
                instructions
            }
        })
        return res.status(200).json({ success: true, updateWork })

    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problemo!", success: false })
    }
})

workerRoute.get('/history', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const [history, total] = await Promise.all([
            prisma.complaint.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                where: {
                    workerId: userId,
                    workAssigneds: {
                        status: 'completed'
                    }
                },
                include: {
                    workAssigneds: {
                        include: {
                            media: true
                        }
                    }
                }
            }),
            prisma.workAssigned.count({
                where: {
                    worker_id: userId,
                    status: 'completed'
                },
            }),
        ]);

        const h = history.map((job) => {
            if (job.workAssigneds!.media.length > 0) {
                return {

                    ...job, hasEvidence: true,
                    completedAt: job.workAssigneds?.updatedAt
                }
            } else {
                return {
                    ...job, hasEvidence: true
                }
            }
        })



        const nextPage = skip + limit < total ? page + 1 : null;

        return res.status(200).json({
            success: true,
            history: h,
            nextPage,
            total,
        });

    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problemo!", success: false })
    }
})




export default workerRoute