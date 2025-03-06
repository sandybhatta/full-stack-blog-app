import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBlog } from '../features/blogSlice'; 
import './UpdateBlogForm.css';

const UpdateBlogForm = ({ blogData, onClose }) => {
  const [title, setTitle] = useState(blogData.title);
  const [content, setContent] = useState(blogData.content);
  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(blogData.title);
    setContent(blogData.content);
  }, [blogData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedBlog = { ...blogData, title, content };
    dispatch(updateBlog(updatedBlog)); 
    onClose();
  };

  return (
    <div className="update-blog-form">
      <h2>Update Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateBlogForm;
