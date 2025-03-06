import Blog from '../models/blog.js';

// Create a new blog post
export const createBlog = async (req, res) => {
  const { title, content, authorName, authorEmail, category, tags } = req.body;

  try {
    if (!title || !content || !authorName || !authorEmail || !category) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const newBlog = new Blog({
      title,
      content,
      userId: req.user.userId, // The logged-in user
      authorName,
      authorEmail,
      category,
      tags: tags || [], // Optional, defaults to an empty array if not provided
    });

    await newBlog.save();
    res.status(201).json({ newBlog });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all blog posts
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email') // Populate user info
      .populate('likes', 'name email') // Populate liked users' info
      .populate('comments.userId', 'name email'); // Populate comment authors' info

    res.json({ blogs });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get a single blog post by its ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id)
      .populate('userId', 'name email')
      .populate('likes', 'name email')
      .populate('comments.userId', 'name email');

    if (!blog) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.json({ blog });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a blog post
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, authorName, authorEmail, category, tags } = req.body;

  try {
    if (!title || !content || !authorName || !authorEmail || !category) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    if (blog.userId.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'You are not authorized to update this post' });
    }

    blog.title = title;
    blog.content = content;
    blog.authorName = authorName;
    blog.authorEmail = authorEmail;
    blog.category = category;
    blog.tags = tags || []; // Update the tags field

    await blog.save();
    res.json({ blog });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
    const { id } = req.params;
  
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ msg: 'Blog post not found' });
      }
  
      // Authorization check: Ensure only the owner can delete
      if (blog.userId.toString() !== req.user.userId) {
        return res.status(403).json({ msg: 'You are not authorized to delete this post' });
      }
  
      // Directly delete the blog
      await blog.deleteOne(); // `deleteOne()` is preferred over `remove()` (deprecated in Mongoose 7+)
  
      res.json({ msg: 'Blog post deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  

// Like a blog post
export const likeBlog = async (req, res) => {
  const { blogId } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    if (blog.likes.includes(req.user.userId)) {
        blog.likes = blog.likes.filter(like => like !== req.user.userId);
    }

    else {
        // Like: Add the user to likes
        blog.likes.push(req.user.userId);
      }
    await blog.save();
    res.status(200).json({ blog });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add a comment to a blog post
export const addComment = async (req, res) => {
  const { blogId, text } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    blog.comments.push({
      userId: req.user.userId,
      text,
    });

    await blog.save();
    res.status(201).json({ blog });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Share a blog post
export const shareBlog = async (req, res) => {
  const { blogId } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    blog.shareCount += 1;
    await blog.save();

    res.status(200).json({ blog });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
