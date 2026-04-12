"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const complainRoute_1 = __importDefault(require("./routes/complainRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const workerRoute_1 = __importDefault(require("./routes/workerRoute"));
console.log("Starting app...");
dotenv_1.default.config();
console.log("DB URL:", process.env.DATABASE_URL ? "✅ loaded" : "❌ undefined");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.get('/test', (req, res) => {
    console.log('Test route hit!');
    res.json({ message: 'Test route works!' });
});
app.use('/api/user', userRoute_1.default);
app.use('/api/complain', complainRoute_1.default);
app.use('/api/admin', adminRoute_1.default);
app.use('/api/worker', workerRoute_1.default);
console.log('yello');
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
