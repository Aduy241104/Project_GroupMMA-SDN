import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: String,
    otpCode: String,
    expiresAt: Date,
    verified: { type: Boolean, default: false }
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;