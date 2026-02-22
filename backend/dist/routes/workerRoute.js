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
workerRoute.post('/update-work', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { workId } = req.body();
        const updateWork = await db_1.default.workAssigned.update({
            where: {
                id: workId
            },
            data: {
                status: 'completed'
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
exports.default = workerRoute;
