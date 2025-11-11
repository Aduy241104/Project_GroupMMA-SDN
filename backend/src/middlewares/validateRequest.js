export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: true });
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            return next(err);
        }
        next();
    };
};
