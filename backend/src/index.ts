import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute";
import complainRoute from "./routes/complainRoute";
import adminRoute from "./routes/adminRoute";
import workerRoute from "./routes/workerRoute";

console.log("Starting app...");

dotenv.config();
console.log("DB URL:", process.env.DATABASE_URL ? "✅ loaded" : "❌ undefined");

const app = express();

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/test', (req, res) => {
    console.log('Test route hit!');
    res.json({ message: 'Test route works!' });
});

app.use('/api/user', userRoute);
app.use('/api/complain', complainRoute);
app.use('/api/admin', adminRoute);
app.use('/api/worker', workerRoute);

console.log('yello')

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
