import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: "Story", required: true },
    chapterNumber: { type: Number, required: true },
    title: String,
    content: String, // cho tiểu thuyết
    images: [String], // cho truyện tranh
}, { timestamps: true });

const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;
