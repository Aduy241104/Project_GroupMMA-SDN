// utils/createResponse.js
import { StatusCodes } from "http-status-codes";

export const createResponse = ({
    success = true,
    statusCode = StatusCodes.OK,
    message = "Success",
    data = null
} = {}) => {
    return { success, statusCode, message, data };
};
