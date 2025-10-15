import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    storyId: { type: Schema.Types.ObjectId, ref: "Story", required: true }
}, { timestamps: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;