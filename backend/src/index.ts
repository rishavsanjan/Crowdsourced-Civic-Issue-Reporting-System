import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
dotenv.config();

const app = express();

app.use(cors({
    origin: ['http://localhost:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/user', userRoute);



app.listen(3000, () => {
    console.log("http://localhost:3000/")
})