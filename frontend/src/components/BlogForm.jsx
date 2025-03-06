import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBlog } from '../features/blogSlice';  // Assuming addBlog is your action to create a blog
import { useNavigate } from 'react-router-dom';
import './BlogForm.css';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error: blogError } = useSelector((state) => state.blogs);  // Get loading and error from Redux

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content || !category || !tags) {
      setError('All fields are required!');
      return;
    }

    const blogData = {
      title,
      content,
      category,
      tags: tags.split(',').map(tag => tag.trim()),
    };

    try {
      // Dispatch the createBlog action
      await dispatch(addBlog(blogData));

      // Check if the action was successful (i.e., the Redux state is updated)
      if (!blogError) {
        navigate('/');  // Redirect to homepage after successful blog creation
      }
    } catch (err) {
      // Handle errors from Redux action if needed
      setError(blogError || 'Failed to create blog');
    }
  };

  return (
    <div className="blog-form-container">
      <h2>Create a New Blog</h2>
      {error && <div className="error-message">{error}</div>}
      {blogError && <div className="error-message">{blogError}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter blog content"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter blog category"
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags (comma separated)"
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
