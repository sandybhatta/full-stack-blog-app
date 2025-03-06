import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateBlogAction } from "../features/blogSlice";

const UpdateBlogPage = () => {
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs); // Get blogs from Redux state
  const loading = useSelector((state) => state.blogs.loading);
  const error = useSelector((state) => state.blogs.error);
  const user = useSelector((state) => state.auth.user); // Get logged-in user details

  const blog = blogs.find((b) => b._id === id);

  // Local state for form fields
  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [category, setCategory] = useState(blog?.category || "");
  const [tags, setTags] = useState(blog?.tags.join(", ") || ""); // Convert array to string

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setCategory(blog.category);
      setTags(blog.tags.join(", ")); // Convert array to comma-separated string
    }
  }, [blog]);

  const handleUpdate = () => {
    dispatch(
      updateBlogAction({
        id,
        title,
        content,
        authorName: user.name,
        authorEmail: user.email,
        category,
        tags: tags.split(",").map((tag) => tag.trim()), // Convert string back to array
      })
    ).then(() => {
      navigate("/profile"); // Redirect to profile after update
    });
  };

  if (loading) return <p>Updating...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="update-blog-container">
      <h1>Update Blog</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
      <button onClick={handleUpdate} disabled={loading}>Update</button>
    </div>
  );
};

export default UpdateBlogPage;
