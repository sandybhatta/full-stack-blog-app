import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  fetchUserBlogs } from "../features/blogSlice"; 
import {  checkAuth, } from "../features/authSlice"; 
import { deleteBlogAction } from "../features/blogSlice";
import { useNavigate } from "react-router-dom";
import "../assets/styles/ProfilePage.css"; 

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); 
  const blogs = useSelector((state) => state.auth.blogs); 
  const { loading, error } = useSelector((state) => state.auth); 

  
  useEffect(() => {
    if (!user) {
      dispatch(checkAuth()); 
    }
    if (user) {
      dispatch(fetchUserBlogs()); 
    }
  }, [dispatch, user]);

 
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/signin");
    }
  }, [user, navigate]);

  
  const handleDelete = async (blogId) => {
     dispatch(deleteBlogAction(blogId));
      
     dispatch(checkAuth())

    dispatch(fetchUserBlogs());
  };

  
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
