import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute";
import complainRoute from "./routes/complainRoute";
import adminRoute from "./routes/adminRoute";
import workerRoute from "./routes/workerRoute";
(async () => {
    try {
        console.log("Starting app...");


        dotenv.config();

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



        app.listen(3000, () => {
            console.log("http://localhost:3000/")
        })

    } catch (err) {
        console.error("App crashed:", err);
    }
})();


