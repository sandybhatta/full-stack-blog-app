import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js'; 
import { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog, 
  likeBlog, 
  addComment, 
  shareBlog 
} from '../controllers/blogController.js';  // Updated import
import Blog from "../models/blog.js"

const router = express.Router();

// CRUD Routes for Blog
router.post('/', authMiddleware, createBlog);  // Create a new blog post
router.get('/', getAllBlogs);  // Fetch all blogs
router.get('/:id', getBlogById);  // Fetch single blog by id
router.put('/:id', authMiddleware, updateBlog);  // Update blog by id
router.delete('/:id', authMiddleware, deleteBlog);  // Delete blog by id

router.get('/user/:email', authMiddleware, async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);  // Decode the email if needed
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const blogs = await Blog.find({ userId: user._id });
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:blogId/comments', async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId).populate('comments.userId'); // Populate user data for each comment
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ comments: blog.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/comment', authMiddleware, addComment);
// New Routes for Like, Comment, and Share
router.post('/like', authMiddleware, likeBlog);  // Like a blog post
  // Add a comment to a blog post
router.post('/share', authMiddleware, shareBlog);  // Share a blog post

export default router;
