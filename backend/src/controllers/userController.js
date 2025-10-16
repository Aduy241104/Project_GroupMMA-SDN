import User from "../models/user.js";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const getAll = async (req, res) => {
    try {
        const rs = await User.find();

        res.status(200).json(rs)
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Thiếu thông tin: username, email hoặc password' });
        }
``
        // Thêm kiểm tra định dạng password
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 
                message: 'Password không hợp lệ! Phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (ví dụ: !@#$).' 
            });
        }

        // Kiểm tra username đã tồn tại
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Username đã tồn tại!' });
        }

        // Kiểm tra email đã tồn tại
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email đã tồn tại!' });
        }

        // Tạo user mới (pre-save hook sẽ hash password)
        const newUser = new User({
            username,
            email,
            password, // Plain text, hook xử lý tự động
            role: 'user' // Default role cho user thường (không phải admin)
        });

        const savedUser = await newUser.save();

        // Response chỉ user info cơ bản (không password, không token)
        res.status(201).json({
            message: 'Đăng ký thành công!',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role,
                avatarUrl: savedUser.avatarUrl || '', // Default rỗng nếu chưa có
                bio: savedUser.bio || '' // Default rỗng
            }
        });
    } catch (error) {
        console.log("ERROR register: ", error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký!' });
    }
};

export default {
    getAll, register
}