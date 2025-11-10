import mongoose from "mongoose";

const readingHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    storyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
        required: true
    },
    lastReadAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Một user chỉ có 1 lịch sử đọc cho mỗi truyện
readingHistorySchema.index({ userId: 1, storyId: 1 }, { unique: true });

const ReadingHistory = mongoose.model("ReadingHistory", readingHistorySchema);

export default ReadingHistory;
