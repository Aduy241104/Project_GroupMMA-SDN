export const errorHandler = (err, req, res, next) => {
    console.error("ERROR: ", err);

    const statusCode = err.statusCode || 500;
    const message =
        typeof err.message === "string"
            ? err.message
            : "Internal server error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
};
