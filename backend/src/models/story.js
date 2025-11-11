import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
     coverImage: String ,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    type: { type: String, enum: ["novel", "comic"], required: true },
    status: { type: String, enum: ["ongoing", "completed", "paused"], default: "ongoing" },
    views: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const Story = mongoose.model("Story", storySchema);

export default Story;