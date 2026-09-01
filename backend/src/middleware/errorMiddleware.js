// Global error handling middleware

export const errorMiddleware = (err, req, res, next) => {
  console.error('[Error Middleware]:', err.stack || err.message || err);
  
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    statusCode,
  });
};

export default errorMiddleware;
