import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (payload, expiresIn = "1h") => {  
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, message: error.message };
    }
};

export default {
    generateToken,
    verifyToken
}
