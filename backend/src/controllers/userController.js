import User from "../models/user.js";
import OTP from "../models/otpVerify.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
dotenv.config();

// Định nghĩa transporter ở ĐÂY - Scope toàn cục, trước các hàm
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const getAll = async (req, res) => {
    try {
        const rs = await User.find();

        res.status(200).json(rs)
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

// Hàm generate OTP 6 chữ số và gửi email (giữ nguyên)
const generateAndSendOTP = async (userId, email) => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số random
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

    // Lưu OTP vào DB (xóa OTP cũ nếu có)
    await OTP.deleteMany({ email });
    const newOTP = new OTP({
        userId,
        email,
        otpCode,
        expiresAt,
        verified: false
    });
    await newOTP.save();

    // Gửi email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Xác thực email - App Đọc Truyện Tranh',
        html: `
            <h2>Xin chào!</h2>
            <p>Mã OTP xác thực email của bạn là: <strong>${otpCode}</strong></p>
            <p>Mã này hết hạn sau 10 phút. Nếu bạn không yêu cầu, hãy bỏ qua.</p>
            <p>Cảm ơn bạn đã đăng ký app đọc truyện tranh!</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP gửi thành công đến ${email}`);
    } catch (error) {
        console.error('Lỗi gửi email:', error);
        throw new Error('Không thể gửi OTP!');
    }
};

// POST /register - Cập nhật: Set isActive: false sau đăng ký, gửi OTP
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Thiếu thông tin: username, email hoặc password' });
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 
                message: 'Password không hợp lệ! Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.' 
            });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Username đã tồn tại!' });
        }

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email đã tồn tại!' });
        }

        const newUser = new User({
            username,
            email,
            password,
            role: 'user',
            isActive: false // Set false tạm thời, verify OTP mới active
        });

        const savedUser = await newUser.save();

        // Gửi OTP sau register
        await generateAndSendOTP(savedUser._id, savedUser.email);

        res.status(201).json({
            message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực OTP.',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role
            }
        });
    } catch (error) {
        console.log("ERROR register: ", error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký!' });
    }
};

// POST /verify-otp - Cập nhật: Set isActive: true sau verify
const verifyOTP = async (req, res) => {
    try {
        const { email, otpCode } = req.body;

        if (!email || !otpCode) {
            return res.status(400).json({ message: 'Thiếu email hoặc OTP' });
        }

        // Tìm OTP
        const otp = await OTP.findOne({ email, otpCode, verified: false });
        if (!otp) {
            return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã sử dụng!' });
        }

        // Check hết hạn
        if (otp.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP đã hết hạn! Vui lòng yêu cầu gửi lại.' });
        }

        // Verify thành công
        otp.verified = true;
        await otp.save();

        // Kích hoạt user bằng cách set isActive: true
        await User.findOneAndUpdate({ email }, { isActive: true });

        res.status(200).json({ message: 'Xác thực email thành công! Bạn có thể đăng nhập.' });
    } catch (error) {
        console.log("ERROR verify OTP: ", error);
        res.status(500).json({ message: 'Lỗi server khi xác thực OTP!' });
    }
};

// GET /users/:id  (admin hoặc chính chủ)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("ERROR getUserById:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// POST /users (admin tạo user)
const createUserByAdmin = async (req, res) => {
  try {
    const { username, email, password, role = "user", avatarUrl = "", bio = "" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Thiếu username/email/password" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "Password không hợp lệ! Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      });
    }

    const existU = await User.findOne({ username });
    if (existU) return res.status(400).json({ message: "Username đã tồn tại" });

    const existE = await User.findOne({ email });
    if (existE) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      username,
      email,
      password: hashed,
      role,
      avatarUrl,
      bio,
      isActive: true // admin tạo thì default active
    });

    const saved = await newUser.save();
    const safe = saved.toObject();
    delete safe.password;

    res.status(201).json({ message: "User created", user: safe });
  } catch (error) {
    console.error("ERROR createUserByAdmin:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PUT /users/:id  (admin hoặc chính chủ)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Nếu có password trong body, hash trước khi lưu
    if (updates.password) {
      if (!PASSWORD_REGEX.test(updates.password)) {
        return res.status(400).json({
          message:
            "Password không hợp lệ! Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
        });
      }
      updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }

    // Không cho user bình thường tự đổi role (nếu muốn, route có thể check)
    if (req.user.role !== "admin" && updates.role) {
      delete updates.role;
    }

    const updated = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Cập nhật thành công", user: updated });
  } catch (error) {
    console.error("ERROR updateUser:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// DELETE /users/:id (admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Xóa user thành công" });
  } catch (error) {
    console.error("ERROR deleteUser:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PATCH /users/:id/block  (admin) -> set isActive = false
const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id || req.user._id;
    
    // Kiểm tra admin không thể block chính mình
    if (currentUserId && currentUserId.toString() === id.toString()) {
      return res.status(400).json({ message: "Bạn không thể block chính tài khoản của mình" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isActive) {
      return res.status(400).json({ message: "User đã bị block từ trước" });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: "User đã bị block" });
  } catch (error) {
    console.error("ERROR blockUser:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PATCH /users/:id/unblock  (admin) -> set isActive = true
const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id || req.user._id;
    
    // Kiểm tra admin không thể unblock chính mình (để nhất quán với block)
    if (currentUserId && currentUserId.toString() === id.toString()) {
      return res.status(400).json({ message: "Bạn không thể unblock chính tài khoản của mình" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isActive) {
      return res.status(400).json({ message: "User đang active" });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({ message: "User đã được unblock" });
  } catch (error) {
    console.error("ERROR unblockUser:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
export default {
  getAll,
  register,
  verifyOTP,
  getUserById,
  createUserByAdmin,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser
};