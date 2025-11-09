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

// POST /change-password - Thay đổi password (yêu cầu auth middleware để lấy user từ token)
const changePassword = async (req, res) => {
  try {
    console.log('== changePassword called =='); // debug marker

    const { oldPassword, newPassword } = req.body;
    console.log('body:', { oldPassword: !!oldPassword, newPassword: !!newPassword });
    console.log(oldPassword)
    const userId = req.user && (req.user.id || req.user._id);
    console.log('userId from req.user:', userId);

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
    console.log('found user:', !!user);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại!' });
    }

    // kiểm tra chính xác: so sánh oldPassword với user.password
    // const isMatch = await bcrypt.compare(oldPassword, user.password);
    const isMatch = user.password === oldPassword;
    console.log('bcrypt compare result:', isMatch);
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

export default {
    getAll, register, verifyOTP, changePassword
}