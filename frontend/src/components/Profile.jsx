import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  fetchUserBlogs } from "../features/blogSlice"; // Import fetchUserBlogs
import {  checkAuth, } from "../features/authSlice"; // Import fetchUserBlogs
import { deleteBlogAction } from "../features/blogSlice"; // Delete action
import { useNavigate } from "react-router-dom";
import "../assets/styles/ProfilePage.css"; // Profile page styling

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Get user from Redux store
  const blogs = useSelector((state) => state.auth.blogs); // Get blogs from auth state
  const { loading, error } = useSelector((state) => state.auth); // Get loading & error state for auth

  // Fetch user data and user blogs when the component mounts
  useEffect(() => {
    if (!user) {
      dispatch(checkAuth()); // Check authentication
    }
    if (user) {
      dispatch(fetchUserBlogs()); // Fetch user-specific blogs
    }
  }, [dispatch, user]);

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/signin");
    }
  }, [user, navigate]);

  // Handle blog deletion
  const handleDelete = async (blogId) => {
     dispatch(deleteBlogAction(blogId));
      // Dispatch delete action
     dispatch(checkAuth())

    dispatch(fetchUserBlogs()); // Fetch updated blogs after delete
  };

  // Handle blog update (navigate to update page)
  const handleUpdate = (blogId) => {
    navigate(`/blogs/update/${blogId}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="container">
      <h1 className="title">My Blogs</h1>
      {blogs.length === 0 ? (
        <p>No blogs found. Start writing your first blog!</p>
      ) : (
        <div className="blog-list">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <h2>{blog.title}</h2>
              <p>{blog.content}</p>
              <div>
                <button onClick={() => handleUpdate(blog._id)}>Update</button>
                <button onClick={() => handleDelete(blog._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
