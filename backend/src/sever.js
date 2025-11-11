import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import connectMongose from "./config/connectDatabase.js";
import route from "./routes/index.js";
import cookieParser from 'cookie-parser';
import { errorHandler } from "./middlewares/errorHandler.js";
import ReadingHistory from "./models/readingHistory.js";

const app = express();

dotenv.config();

connectMongose();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(morgan("combined"));


route(app);
app.use(errorHandler);

app.get("/test/heee2", (req, res) => {
    res.status(200).send({ message: "hello" })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
