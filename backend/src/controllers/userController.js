// import User from "../models/user.js";
import OTP from "../models/otpVerify.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const SALT_ROUNDS = 10;

/**
 * Transporter (scope toàn cục)
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Regex password: tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt
 */
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Lấy tất cả user (ẩn password nếu cần phía client)
 */
const getAll = async (req, res) => {
  try {
    const rs = await User.find().select("-password");
    res.status(200).json(rs);
  } catch (error) {
    console.log("ERROR getAll: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * Generate OTP 6 chữ số, lưu vào collection OTP và gửi email
 */
const generateAndSendOTP = async (userId, email, subject, htmlTemplate) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Xóa OTP cũ cùng email
  await OTP.deleteMany({ email });

  await new OTP({
    userId,
    email,
    otpCode,
    expiresAt,
    verified: false,
  }).save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject || "Xác thực email - App Đọc Truyện Tranh",
    html: htmlTemplate
      ? htmlTemplate(otpCode)
      : `
        <h2>Xin chào!</h2>
        <p>Mã OTP xác thực email của bạn là: <strong>${otpCode}</strong></p>
        <p>Mã này hết hạn sau 10 phút. Nếu bạn không yêu cầu, hãy bỏ qua.</p>
        <p>Cảm ơn bạn đã đăng ký app đọc truyện tranh!</p>
      `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * POST /register
 * - kiểm tra dữ liệu
 * - hash password
 * - lưu user với isActive: false
 * - gửi OTP
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin: username, email hoặc password" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "Password không hợp lệ! Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
      });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username đã tồn tại!" });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
      isActive: false, // verify OTP mới active
    });

    const savedUser = await newUser.save();

    // Gửi OTP sau register
    await generateAndSendOTP(savedUser._id, savedUser.email);

    res.status(201).json({
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực OTP.",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.log("ERROR register: ", error);
    res.status(500).json({ message: "Lỗi server khi đăng ký!" });
  }
};

/**
 * POST /verify-otp
 * - verify OTP, set user.isActive = true
 */
const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({ message: "Thiếu email hoặc OTP" });
    }

    const otp = await OTP.findOne({ email, otpCode, verified: false });
    if (!otp) {
      return res
        .status(400)
        .json({ message: "OTP không hợp lệ hoặc đã sử dụng!" });
    }

    if (otp.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP đã hết hạn! Vui lòng yêu cầu gửi lại." });
    }

    otp.verified = true;
    await otp.save();

    await User.findOneAndUpdate({ email }, { isActive: true });

    res
      .status(200)
      .json({ message: "Xác thực email thành công! Bạn có thể đăng nhập." });
  } catch (error) {
    console.log("ERROR verify OTP: ", error);
    res.status(500).json({ message: "Lỗi server khi xác thực OTP!" });
  }
};

/**
 * GET /users/:id  (admin hoặc chính chủ)
 */
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

/**
 * POST /users (admin tạo user)
 */
const createUserByAdmin = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role = "user",
      avatarUrl = "",
      bio = "",
    } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Thiếu username/email/password" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "Password không hợp lệ! Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
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
      isActive: true, // admin tạo thì default active
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

/**
 * PUT /users/:id  (admin hoặc chính chủ)
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Nếu có password trong body, hash trước khi lưu
    if (updates.password) {
      if (!PASSWORD_REGEX.test(updates.password)) {
        return res.status(400).json({
          message:
            "Password không hợp lệ! Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
        });
      }
      updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }

    // Không cho user bình thường tự đổi role (route middleware vẫn nên kiểm tra)
    if (req.user && req.user.role !== "admin" && updates.role) {
      delete updates.role;
    }

    const updated = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");
    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Cập nhật thành công", user: updated });
  } catch (error) {
    console.error("ERROR updateUser:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * DELETE /users/:id (admin)
 */
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

/**
 * PATCH /users/:id/block  (admin) -> set isActive = false
 */
const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user && (req.user.id || req.user._id);

    // Kiểm tra admin không thể block chính mình
    if (currentUserId && currentUserId.toString() === id.toString()) {
      return res
        .status(400)
        .json({ message: "Bạn không thể block chính tài khoản của mình" });
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

/**
 * PATCH /users/:id/unblock  (admin) -> set isActive = true
 */
const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user && (req.user.id || req.user._id);

    // Kiểm tra admin không thể unblock chính mình (nhất quán với block)
    if (currentUserId && currentUserId.toString() === id.toString()) {
      return res
        .status(400)
        .json({ message: "Bạn không thể unblock chính tài khoản của mình" });
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

/**
 * POST /change-password
 * - yêu cầu auth middleware để có req.user
 * - so sánh bằng bcrypt.compare
 * - hash password mới trước khi lưu
 */
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user && (req.user.id || req.user._id);

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Thiếu password cũ hoặc mới!" });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password mới không hợp lệ! Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password cũ sai!" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedNewPassword;
    await user.save();

    res
      .status(200)
      .json({ message: "Thay đổi password thành công! Hãy login lại để kiểm tra." });
  } catch (error) {
    console.log("ERROR change password: ", error);
    res.status(500).json({ message: "Lỗi server khi thay đổi password!" });
  }
};

/**
 * POST /forgot-password
 * - gửi OTP reset đến email
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Thiếu email!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại!" });
    }

    // Gửi OTP reset với subject và template riêng
    await generateAndSendOTP(
      user._id,
      email,
      "Reset Password - App Đọc Truyện Tranh",
      (otpCode) => `
        <h2>Xin chào!</h2>
        <p>Bạn đã yêu cầu reset password. Mã OTP của bạn là: <strong>${otpCode}</strong></p>
        <p>Mã này hết hạn sau 10 phút. Nếu bạn không yêu cầu, hãy bỏ qua.</p>
        <p>Cảm ơn bạn!</p>
      `
    );

    res
      .status(200)
      .json({ message: "OTP reset password đã gửi đến email! Kiểm tra và reset ngay." });
  } catch (error) {
    console.log("ERROR forgot password: ", error);
    res.status(500).json({ message: "Lỗi server khi gửi OTP reset!" });
  }
};

/**
 * POST /reset-password
 * - nhận email, otpCode, newPassword
 * - check OTP, hash newPassword, lưu, đánh dấu OTP verified
 */
const resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
      return res
        .status(400)
        .json({ message: "Thiếu email, OTP hoặc password mới!" });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password mới không hợp lệ! Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
      });
    }

    const otp = await OTP.findOne({ email, otpCode, verified: false });
    if (!otp) {
      return res
        .status(400)
        .json({ message: "OTP không hợp lệ hoặc đã sử dụng!" });
    }

    if (otp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP đã hết hạn! Yêu cầu gửi lại." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedNewPassword;
    await user.save();

    otp.verified = true;
    await otp.save();

    res
      .status(200)
      .json({ message: "Reset password thành công! Hãy login với password mới để tiếp tục đọc truyện tranh." });
  } catch (error) {
    console.log("ERROR reset password: ", error);
    res.status(500).json({ message: "Lỗi server khi reset password!" });
  }
};

/**
 * PUT /update-profile
 * - cập nhật username, avatarUrl, bio (yêu cầu auth)
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    const { username, avatarUrl, bio } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Không tìm thấy user! Vui lòng đăng nhập lại." });
    }

    if (!username && !avatarUrl && bio === undefined) {
      return res.status(400).json({ message: "Không có thông tin nào để cập nhật!" });
    }

    const updateFields = {};
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Username đã tồn tại! Chọn username khác." });
      }
      updateFields.username = username;
    }
    if (avatarUrl) updateFields.avatarUrl = avatarUrl;
    if (bio !== undefined) updateFields.bio = bio; // cho phép bio rỗng để xóa

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    }).select("-password -__v -createdAt -updatedAt");

    if (!updatedUser) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    res.status(200).json({
      message: "Cập nhật profile thành công! Hãy refresh app để xem thay đổi.",
      user: updatedUser,
    });
  } catch (error) {
    console.log("ERROR update profile: ", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật profile!" });
  }
};

/**
 * GET /profile
 * - xem thông tin cá nhân (auth required)
 */
const viewProfile = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);

    if (!userId) {
      return res.status(401).json({ message: "Không tìm thấy user! Vui lòng đăng nhập lại." });
    }

    const user = await User.findById(userId).select("-password -__v -createdAt -updatedAt");

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    res.status(200).json({
      message: "Lấy thông tin profile thành công!",
      user,
    });
  } catch (error) {
    console.log("ERROR view profile: ", error);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin profile!" });
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
  unblockUser,
  changePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
  viewProfile,
};
