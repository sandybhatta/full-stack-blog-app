import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from "../models/user.js"



dotenv.config();

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token and handle expiration separately
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID to the request object (accessible in controllers)
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired, please log in again' });
    }
    console.error(error.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


 export const protect = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret key

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user to the request object
    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

