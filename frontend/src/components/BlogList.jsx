// src/components/BlogList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../features/blogSlice';
import BlogCard from './BlogCard';
import './BlogList.css';

const BlogList = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogs()); // Fetch blogs when the component mounts
  }, [dispatch]);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="blog-list-container">
      {blogs.length > 0 ? (
        blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
      ) : (
        <p>No blogs available.</p>
      )}
    </div>
  );
};

export default BlogList;
