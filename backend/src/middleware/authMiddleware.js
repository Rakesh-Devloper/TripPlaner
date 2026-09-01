// Authentication & Session Middleware

export const authMiddleware = (req, res, next) => {
  // In this lightweight setup, we support optional authorization headers
  const authHeader = req.headers.authorization;
  if (authHeader) {
    req.user = { id: 'authenticated_user', token: authHeader };
  }
  next();
};

export default authMiddleware;
