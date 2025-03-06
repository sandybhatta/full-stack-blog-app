import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../features/blogSlice";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router-dom";
import Loading from "../components/Loading"; // Import the Loading component
import "../assets/styles/HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs); // Fix to `state.blogs`
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  return (
    <div className="homepage-container">
      <nav className="navbar">
        <h1>Blog Platform</h1>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/create-blog">Create Blog</Link>
            </>
          ) : (
            <Link to="/signin">Sign In</Link>
          )}
        </div>
      </nav>

      <h2>Blog Feed</h2>

      {loading && <Loading />} {/* Use the Loading component instead of plain text */}

      {error && <p className="error-text">{error}</p>} {/* Add error-text CSS class */}

      <div className="blog-list">
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <p>No blogs available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
