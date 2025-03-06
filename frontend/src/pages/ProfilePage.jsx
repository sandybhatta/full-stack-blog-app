import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBlogs } from "../features/blogSlice";  // Import the action to fetch blogs
import { checkAuth } from "../features/authSlice";  // Action for checking user authentication
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import "../assets/styles/ProfilePage.css";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Get user from Redux store
  const { blogs, loading, error } = useSelector((state) => state.blogs); // Get blogs from blogSlice
  const authLoading = useSelector((state) => state.auth.loading); // Get loading status for authentication

  // Fetch user data and blogs when the component mounts
  useEffect(() => {
    if (!user) {
      dispatch(checkAuth()); // Check if user is authenticated on page load
    }
  }, [dispatch, user]);

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/signin"); // Redirect to login if the user is not authenticated or no email found
    }
  }, [user, navigate]);

  // Handle blog deletion
  const handleDelete = (blogId) => {
    dispatch(deleteBlogAction(blogId)); // Dispatch delete blog action
  };

  if (authLoading || loading) {
    return <p>Loading...</p>; // Show loading state while fetching data
  }

  if (error) {
    return <p className="error">{error}</p>; // Show error if any occurs
  }

  return (
    <div className="container">
      <h1 className="title">My Blogs</h1>
      {blogs && blogs.length === 0 ? (
        <p>No blogs found. Start writing your first blog!</p>
      ) : (
        <div className="blog-list">
          {blogs?.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onDelete={() => handleDelete(blog._id)}
              onEdit={() => navigate(`/update-blog/${blog._id}`)}
              isOwner={true} // Allows editing/deleting for the blog owner
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
