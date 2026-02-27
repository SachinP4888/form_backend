// const errorHandler = (error, req, res, next) => {
//   const statusCode = error.statusCode || 500;
//   const massage = error.message || "server error";
//   res.status(statusCode).json({ massage: massage });
// };
// module.exports = errorHandler;


const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Server error";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;