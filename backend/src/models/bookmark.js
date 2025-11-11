import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: "Story", required: true }
}, { timestamps: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;