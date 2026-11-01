const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500
            ? "Internal Server Error"
            : message
    });
};

export default errorMiddleware;