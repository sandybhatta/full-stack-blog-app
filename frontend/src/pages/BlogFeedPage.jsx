import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../features/blogSlice"; // Assuming the fetchBlogs action is correctly implemented in blogSlice
import BlogCard from "../components/BlogCard";
import Navbar from "../components/Navbar"; // Importing Navbar component
import Footer from "../components/Footer"; // Importing Footer component
import ToastMessage from "../components/ToastMessage"; // If you're using ToastMessage for errors or success
import Loading from "../components/Loading"; // Importing the Loading component
import "../assets/styles/BlogFeedPage.css"; // Assuming the CSS file is in the assets/styles folder

const BlogFeedPage = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs); // Accessing blogs, loading, and error states correctly
  

  // Fetch blogs when component mounts
  useEffect(() => {
    dispatch(fetchBlogs()); // Dispatch the action to fetch blogs
  }, [dispatch]);

  // Handle loading and error states
  if (loading) return <Loading />; // Using Loading component when data is loading
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="blog-feed-container">
     
      
      <h2 className="feed-title">Blog Feed</h2>
      
      {/* Show ToastMessage for success/error */}
      {/* {message && <ToastMessage message={message} />}  */}

      <div className="blog-list">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />) // Map through the blogs and render BlogCard components
        ) : (
          <p className="no-blogs">No blogs available.</p>
        )}
      </div>

      <Footer /> {/* Render Footer component */}
    </div>
  );
};

export default BlogFeedPage;
