
import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  console.log('this middleware is working')
  const token = req.cookies?.token;
  console.log(token)
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token missing, Not authenticated'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
