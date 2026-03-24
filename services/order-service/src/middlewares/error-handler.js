const errorHandlerMiddleware = (error, _req, res) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  res.status(statusCode).json({ error: message });
};

export default errorHandlerMiddleware;
