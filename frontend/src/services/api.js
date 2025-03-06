const API_URL = "http://localhost:4000/api";  // Update to your backend URL

// Utility function for making API requests
const fetchData = async (url, method = "GET", body = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // Check if response is not OK and throw an error
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.msg || "Something went wrong");
  }

  // Return response data
  return response.json();
};

// Export API methods

// Signup, Signin, Profile - No change needed
export const signupUser = async (userData) => {
  return fetchData("/auth/signup", "POST", userData);
};

export const signinUser = async (userData) => {
  return fetchData("/auth/signin", "POST", userData);
};

export const getProfile = async (token) => {
  return fetchData("/auth/profile", "GET", null, token);
};

// Blog-related functions

// Create a blog
export const createBlog = async (blogData, token) => {
  return fetchData("/blogs", "POST", blogData, token);
};

// Get all blogs
export const getAllBlogs = async () => {
  return fetchData("/blogs", "GET");
};

// Get blogs by a specific user
export const getUserBlogs = async (email, token) => {
  return fetchData(`/blogs/user/${email}`, "GET", null, token);
};

// Update a blog
export const updateBlog = async (id, blogData, token) => {
  return fetchData(`/blogs/${id}`, "PUT", blogData, token);
};

// Delete a blog
export const deleteBlog = async (id, token) => {
  return fetchData(`/blogs/${id}`, "DELETE", null, token);
};

// Like a blog
export const likeBlog = async (blogId, token) => {
  return fetchData("/blogs/like", "POST", { blogId }, token);
};

// Share a blog
export const shareBlog = async (blogId, token) => {
  return fetchData("/blogs/share", "POST", { blogId }, token);
};

// New: Get comments for a specific blog
export const getCommentsForBlog = async (blogId) => {
  return fetchData(`/blogs/${blogId}/comments`, "GET");  // Fetch comments for a specific blog
};

// Submit a comment on a blog
export const commentOnBlog = async (blogId, commentData, token) => {
  return fetchData("/blogs/comment", "POST", { blogId, ...commentData }, token);  // Submit comment to the server
};
export const fetchCommentsFromApi = async (blogId) => {
  const response = await fetch(`http://localhost:4000/api/blogs/${blogId}/comments`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  const data = await response.json();
  return data.comments; 
};
