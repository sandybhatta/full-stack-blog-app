import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBlog } from "../features/blogSlice";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../components/ToastMessage";
import "../assets/styles/CreateBlogPage.css";

const CreateBlogPage = () => {
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // State for errors

  const { user } = useSelector((state) => state.auth);
  
  // Destructure only the needed parts from state.blog to avoid unnecessary rerenders
  const blogState = useSelector((state) => state.blogs);
  const { loading, error } = blogState;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset errors

    if (!blogData.title || !blogData.content || !blogData.category) {
      setErrorMessage("Please provide all required fields.");
      return;
    }

    if (!user) {
      setErrorMessage("Please sign in to create a blog post.");
      return;
    }

    const newBlog = {
      ...blogData,
      tags: blogData.tags.split(",").map((tag) => tag.trim()),
      authorName: user?.name,
      authorEmail: user?.email,
    };

    try {
      await dispatch(addBlog(newBlog)).unwrap();
      navigate("/blogs"); // Redirect to blogs page after successful creation
      setBlogData({ title: "", content: "", category: "", tags: "" });
    } catch (err) {
      setErrorMessage("Error creating blog: " + err.message);
    }
  };

  return (
    <div className="create-blog-page">
      <h2>Create a New Blog Post</h2>

      {errorMessage && <ToastMessage message={errorMessage} />} {/* Show error message */}

      <form onSubmit={handleSubmit} className="blog-form">
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={blogData.title}
          onChange={handleChange}
          required
          className="input-field"
        />
        <textarea
          name="content"
          placeholder="Write your blog content here..."
          value={blogData.content}
          onChange={handleChange}
          required
          className="textarea-field"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={blogData.category}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={blogData.tags}
          onChange={handleChange}
          className="input-field"
        />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPage;

