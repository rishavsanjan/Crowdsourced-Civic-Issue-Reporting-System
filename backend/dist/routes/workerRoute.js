"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const userAuth_1 = __importDefault(require("../middlewares/userAuth"));
const workerRoute = express_1.default.Router();
workerRoute.post('/login', async (req, res) => {
    try {
        const { number, password } = await req.body;
        const worker = await db_1.default.worker.findUnique({
            where: {
                phoneNumber: number
            }
        });
        if (!worker) {
            return res.status(401).json({ message: "Wrong number!", success: false });
        }
        // const match = await bcrypt.compare(password, worker.password);
        const match = password === worker.password;
        console.log(password, worker.password);
        if (!match) {
            return res.status(401).json({ error: "Wrong password!", success: false });
        }
        const token = jsonwebtoken_1.default.sign({ user_id: worker.id, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET);
        return res.status(200).json({ msg: token, success: true });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
workerRoute.get('/isValid', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const user = await db_1.default.worker.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                phoneNumber: true
            }
        });
        return res.status(200).json({ msg: 'success', success: true, user: user });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
workerRoute.get('/get-jobs', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const [jobs, total] = await Promise.all([
            db_1.default.complaint.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                where: {
                    workerId: userId,
                    workAssigneds: {
                        status: 'pending'
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
            db_1.default.complaint.count({
                where: {
                    workerId: userId,
                    workAssigneds: {
                        status: 'pending'
                    },
                },
            }),
        ]);
        const final = jobs.map((job) => {
            var _a, _b;
            return {
                ...job,
                workerWorkStatus: (_a = job.workAssigneds) === null || _a === void 0 ? void 0 : _a.status,
                workAssignedAt: (_b = job.workAssigneds) === null || _b === void 0 ? void 0 : _b.createdAt,
                hasEvidence: job.workAssigneds.media.length > 0 ? true : false
            };
        });
        const nextPage = skip + limit < total ? page + 1 : null;
        return res.status(200).json({
            success: true,
            jobs: final,
            nextPage,
            total,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Server Problem!",
            success: false,
        });
    }
});
workerRoute.get('/profile', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const user = await db_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        const totalWorks = await db_1.default.workAssigned.count({
            where: {
                worker_id: userId
            }
        });
        const successWork = await db_1.default.workAssigned.count({
            where: {
                status: 'completed',
                worker_id: userId
            }
        });
        const final = { ...user, totalTasks: totalWorks, successRate: successWork };
        return res.status(200).json({ success: true, final });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
workerRoute.get('/job', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const id = Number(req.query.id);
        const job = await db_1.default.workAssigned.findUnique({
            where: {
                id
            },
            include: {
                worker: true,
                complaint: true
            }
        });
        return res.status(200).json({
            job, success: true
        });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
workerRoute.post('/upload-job', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { jobId, media, comment } = req.body;
        const result = await db_1.default.$transaction(async (tx) => {
            await tx.workAssigned.update({
                where: {
                    id: jobId
                },
                data: {
                    status: 'completed',
                    workerComment: comment
                }
            });
            if (media && media.length > 0) {
                const mediaData = media.map((item) => ({
                    workId: jobId,
                    file_url: item.file_url,
                    file_type: item.file_type === 'photo' ? 'image' : 'video'
                }));
                await tx.jobEvidence.createMany({
                    data: mediaData
                });
            }
        });
        return res.status(200).json({ success: true, result });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
workerRoute.post('/update-instructions', async (req, res) => {
    try {
        let { instructions, workId } = req.body;
        workId = Number(workId);
        const updateWork = await db_1.default.workAssigned.update({
            where: {
                id: workId
            },
            data: {
                instructions
            }
        });
        return res.status(200).json({ success: true, updateWork });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problemo!", success: false });
    }
});
workerRoute.get('/history', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const [history, total] = await Promise.all([
            db_1.default.complaint.findMany({
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
            db_1.default.workAssigned.count({
                where: {
                    worker_id: userId,
                    status: 'completed'
                },
            }),
        ]);
        const h = history.map((job) => {
            var _a, _b, _c, _d;
            if (job.workAssigneds.media.length > 0) {
                return {
                    ...job, hasEvidence: true,
                    completedAt: (_a = job.workAssigneds) === null || _a === void 0 ? void 0 : _a.updatedAt,
                    workerWorkStatus: (_b = job.workAssigneds) === null || _b === void 0 ? void 0 : _b.status,
                    evidenceUrl: (_c = job.workAssigneds) === null || _c === void 0 ? void 0 : _c.media[0],
                    workId: (_d = job.workAssigneds) === null || _d === void 0 ? void 0 : _d.id
                };
            }
            else {
                return {
                    ...job, hasEvidence: true
                };
            }
        });
        const nextPage = skip + limit < total ? page + 1 : null;
        return res.status(200).json({
            success: true,
            history: h,
            nextPage,
            total,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problemo!", success: false });
    }
});
workerRoute.get('/summary', userAuth_1.default, async (req, res) => {
    var _a, _b;
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const id = Number(req.query.id);
        console.log(id);
        const job = await db_1.default.complaint.findUnique({
            where: {
                complaint_id: id
            },
            include: {
                workAssigneds: {
                    select: {
                        updatedAt: true,
                        workerComment: true,
                        media: true
                    }
                }
            }
        });
        const final = {
            id: job === null || job === void 0 ? void 0 : job.complaint_id,
            title: job === null || job === void 0 ? void 0 : job.title,
            department: job === null || job === void 0 ? void 0 : job.category,
            completionDate: job === null || job === void 0 ? void 0 : job.updated_at,
            workerComments: (_a = job === null || job === void 0 ? void 0 : job.workAssigneds) === null || _a === void 0 ? void 0 : _a.workerComment,
            location: job === null || job === void 0 ? void 0 : job.address,
            evidence: ((_b = job === null || job === void 0 ? void 0 : job.workAssigneds) === null || _b === void 0 ? void 0 : _b.media) || []
        };
        return res.status(200).json({
            summary: final, success: true
        });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
exports.default = workerRoute;
