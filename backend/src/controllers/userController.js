import User from "../models/user.js";
import OTP from "../models/otpVerify.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';

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
const generateAndSendOTP = async (userId, email, subject, htmlTemplate) => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.deleteMany({ email });

    await new OTP({
        userId,
        email,
        otpCode,
        expiresAt,
        verified: false
    }).save();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject || 'Xác thực email - App Đọc Truyện Tranh',
        html: htmlTemplate
            ? htmlTemplate(otpCode)
            : `
                <h2>Xin chào!</h2>
                <p>Mã OTP xác thực email của bạn là: <strong>${otpCode}</strong></p>
                <p>Mã này hết hạn sau 10 phút. Nếu bạn không yêu cầu, hãy bỏ qua.</p>
                <p>Cảm ơn bạn đã đăng ký app đọc truyện tranh!</p>
            `
    };

    await transporter.sendMail(mailOptions);
}


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

// POST /change-password - Thay đổi password (yêu cầu auth middleware để lấy user từ token)
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user && (req.user.id || req.user._id);

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Thiếu password cũ hoặc mới!' });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        message:
          'Password mới không hợp lệ! Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại!' });
    }

    // kiểm tra chính xác: so sánh oldPassword với user.password
    // const isMatch = await bcrypt.compare(oldPassword, user.password);
    const isMatch = user.password === oldPassword;
    if (!isMatch) {
      return res.status(401).json({ message: 'Password cũ sai!' });
    }

    // const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    // user.password = hashedNewPassword;
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Thay đổi password thành công! Hãy login lại để kiểm tra.' });
  } catch (error) {
    console.log('ERROR change password: ', error);
    res.status(500).json({ message: 'Lỗi server khi thay đổi password!' });
  }
};

// POST /forgot-password - Quên password: Gửi OTP reset đến email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Thiếu email!' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại!' });
        }

        // Gửi OTP reset (tái sử dụng generateAndSendOTP, tùy chỉnh subject/html)
        await generateAndSendOTP(
            user._id,
            email,
            'Reset Password - App Đọc Truyện Tranh',
            (otpCode) => `
                <h2>Xin chào!</h2>
                <p>Bạn đã yêu cầu reset password. Mã OTP của bạn là: <strong>${otpCode}</strong></p>
                <p>Mã này hết hạn sau 10 phút. Nếu bạn không yêu cầu, hãy bỏ qua để tránh mất tài khoản đọc truyện tranh yêu thích.</p>
                <p>Cảm ơn bạn!</p>
            `
   
        );

        res.status(200).json({ message: 'OTP reset password đã gửi đến email! Kiểm tra và reset ngay.' });
    } catch (error) {
        console.log("ERROR forgot password: ", error);
        res.status(500).json({ message: 'Lỗi server khi gửi OTP reset!' });
    }
};

// POST /reset-password - Reset password với OTP và newPassword
const resetPassword = async (req, res) => {
    try {
        const { email, otpCode, newPassword } = req.body;

        if (!email || !otpCode || !newPassword) {
            return res.status(400).json({ message: 'Thiếu email, OTP hoặc password mới!' });
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            return res.status(400).json({ 
                message: 'Password mới không hợp lệ! Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.' 
            });
        }

        // Check OTP
        const otp = await OTP.findOne({ email, otpCode, verified: false });
        if (!otp) {
            return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã sử dụng!' });
        }

        if (otp.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP đã hết hạn! Yêu cầu gửi lại.' });
        }

        // Update password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại!' });
        }

        // const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        user.password = newPassword;
        await user.save();

        // Mark OTP verified
        otp.verified = true;
        await otp.save();

        res.status(200).json({ message: 'Reset password thành công! Hãy login với password mới để tiếp tục đọc truyện tranh.' });
    } catch (error) {
        console.log("ERROR reset password: ", error);
        res.status(500).json({ message: 'Lỗi server khi reset password!' });
    }
};

// PUT /update-profile - Cập nhật profile: username, avatarUrl, bio (yêu cầu auth middleware để lấy user từ token)
const updateProfile = async (req, res) => {
    try {
        const userId = req.user && (req.user.id || req.user._id);
        const { username, avatarUrl, bio } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Không tìm thấy user! Vui lòng đăng nhập lại.' });
        }

        if (!username && !avatarUrl && bio === undefined) {
            return res.status(400).json({ message: 'Không có thông tin nào để cập nhật!' });
        }

        const updateFields = {};
        if (username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                return res.status(400).json({ message: 'Username đã tồn tại! Chọn username khác.' });
            }
            updateFields.username = username;
        }
        if (avatarUrl) updateFields.avatarUrl = avatarUrl;
        if (bio !== undefined) updateFields.bio = bio; // Cho phép bio rỗng để xóa

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select('-password -__v -createdAt -updatedAt');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User không tồn tại!' });
        }

        res.status(200).json({
            message: 'Cập nhật profile thành công! Hãy refresh app để xem thay đổi.',
            user: updatedUser
        });
    } catch (error) {
        console.log("ERROR update profile: ", error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật profile!' });
    }
};

// GET /profile - Xem thông tin cá nhân (yêu cầu middleware auth)
const viewProfile = async (req, res) => {
    try {
        const userId = req.user && (req.user.id || req.user._id);

        if (!userId) {
            return res.status(401).json({ message: 'Không tìm thấy user! Vui lòng đăng nhập lại.' });
        }

        // Lấy thông tin user, ẩn password và các trường không cần thiết
        const user = await User.findById(userId).select('-password -__v -createdAt -updatedAt');

        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại!' });
        }

        res.status(200).json({
            message: 'Lấy thông tin profile thành công!',
            user
        });
    } catch (error) {
        console.log("ERROR view profile: ", error);
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin profile!' });
    }
};

export default {
    getAll, register, verifyOTP, changePassword, forgotPassword, resetPassword, updateProfile, viewProfile
}