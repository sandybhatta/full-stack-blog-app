import express from 'express';
import { signUp, signIn } from '../controllers/userController.js'; // Import controllers
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
import Blog from "../models/blog.js"
// POST /api/auth/signup - Register a new user
router.post('/signup', signUp);

// POST /api/auth/signin - Log in an existing user
router.post('/signin', signIn);

router.get('/profile', protect, async (req, res) => {
    try {
      const user = req.user; // User is attached by the auth middleware
      const blogs = await Blog.find({ authorEmail: user.email }).sort({ createdAt: -1 })
      console.log("user blogs are", blogs)
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        blogs: blogs,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
export default router;
