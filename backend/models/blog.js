import mongoose from 'mongoose';

// Define the Blog Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true }, // Store author's name
  authorEmail: { type: String, required: true }, // Store author's email
  category: { type: String, required: true }, // Blog category (e.g., Tech, Food)
  tags: [{ type: String }], // Array of tags (e.g., ['React', 'JavaScript'])
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the post
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who commented
      text: { type: String, required: true }, // Comment text
      createdAt: { type: Date, default: Date.now },
    }
  ],
  shareCount: { type: Number, default: 0 }, // Number of shares
}, { timestamps: true }); // Automatically add createdAt and updatedAt

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
