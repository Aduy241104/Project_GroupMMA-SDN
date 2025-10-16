import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Định nghĩa __dirname trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load biến môi trường
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });


const dbURL = process.env.DATABASE;

const connectMongoose = async () => {
    try {
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("🚁 MongoDB connected successfully");
    } catch (err) {
        console.error("🙄 MongoDB connection error:", err);
    }
};

export default connectMongoose;
