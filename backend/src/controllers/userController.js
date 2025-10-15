import User from "../models/user.js";

const getAll = async (req, res) => {
    try {

        const rs = await User.find();

        res.status(200).json(rs)
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

export default {
    getAll
}