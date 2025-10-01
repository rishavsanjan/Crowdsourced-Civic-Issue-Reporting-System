import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import complainRoute from "./routes/complainRoute.js";
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
app.use('/api/complain', complainRoute)



app.listen(3000, () => {
    console.log("http://localhost:3000/")
})