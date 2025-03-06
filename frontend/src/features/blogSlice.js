import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentOnBlog,
  shareBlog,
  getUserBlogs, 
} from '../services/api';

import { fetchCommentsFromApi } from '../services/api'
const initialState = {
  blogs: [],
  userBlogs: [],  // Added for managing user-specific blogs
  loading: false,
  error: null,
};

// Fetch all blogs
export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async (_, { rejectWithValue }) => {
  try {
    const data = await getAllBlogs();
    return data.blogs;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Fetch blogs specific to the user
export const fetchUserBlogs = createAsyncThunk(
  'blogs/fetchUserBlogs',
  async ({ email, token }) => {
    const response = await getUserBlogs(email, token); // Pass token here
    return response; // Return the response which contains blogs
  }
);

// Add a new blog
export const addBlog = createAsyncThunk(
  'blogs/addBlog',
  async (blogData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const data = await createBlog(blogData, token);
      return data.newBlog;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update a blog
export const updateBlogAction = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, title, content, authorName, authorEmail, category, tags }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
        },
        body: JSON.stringify({ title, content, authorName, authorEmail, category, tags }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.msg || "Failed to update blog");
      }

      const data = await response.json();
      return data.blog; // Return updated blog
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a blog
export const deleteBlogAction = createAsyncThunk(
  'blogs/deleteBlog',
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      await deleteBlog(id, token);
      return id; // Return blog ID to remove it from state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Like a blog
export const likeBlogAction = createAsyncThunk(
  'blogs/likeBlog',
  async ({ blogId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/blogs/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Pass the token for authorization
        },
        body: JSON.stringify({ blogId }), // Send the blogId in the body
      });

      if (!response.ok) {
        throw new Error('Failed to like the blog');
      }

      const data = await response.json();
      return data.blog; // Returning the updated blog after like operation
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);

 

export const getCommentsAction = createAsyncThunk(
  'blogs/getComments',
  async ({ blogId }) => {
    const comments = await fetchCommentsFromApi(blogId);
    return comments; 
  }
);








// Comment on a blog
export const commentOnBlogAction = createAsyncThunk(
  'blogs/commentOnBlog',
  async ({ blogId, commentData }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const data = await commentOnBlog(blogId, commentData, token);
      return data.blog;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Share a blog
export const shareBlogAction = createAsyncThunk(
  'blogs/shareBlog',
  async (blogId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const data = await shareBlog(blogId, token);
      return data.blog;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchComments = createAsyncThunk(
  'blogs/fetchComments',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}/comments`); // Update to match your backend's route
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      return data.comments; // Assuming the API returns an object with the comments array
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Blog slice
const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload; // Set the blogs data when fetching blogs
    },
    toggleLike: (state, action) => {
      const { blogId } = action.payload;
      const blog = state.blogs.find((b) => b.id === blogId);

      if (blog) {
        const isLiked = blog.likes.includes(blogId);
        if (isLiked) {
          blog.likes = blog.likes.filter((id) => id !== blogId); // Remove like
        } else {
          blog.likes.push(blogId); // Add like
        }
      }
    },
    addComment: (state, action) => {
      const { blogId, comment } = action.payload;
      const blog = state.blogs.find((b) => b.id === blogId);

      if (blog) {
        blog.comments.push(comment); // Add new comment
      }
    },
    incrementShareCount: (state, action) => {
      const { blogId } = action.payload;
      const blog = state.blogs.find((b) => b.id === blogId);

      if (blog) {
        blog.shareCount += 1; // Increment share count
      }
    },
    
  },
  extraReducers: (builder) => {
    // Handle fetch all blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetch user blogs
      .addCase(fetchUserBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchUserBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle add blog
      .addCase(addBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.push(action.payload); // Add the new blog to the state
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle update blog
      .addCase(updateBlogAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlogAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) state.blogs[index] = action.payload;
      })
      .addCase(updateBlogAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle delete blog
      .addCase(deleteBlogAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlogAction.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload); // Remove deleted blog from state
      })
      .addCase(deleteBlogAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle like blog
      .addCase(likeBlogAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(likeBlogAction.fulfilled, (state, action) => {
        state.loading = false;
        // Update the state with the new blog data after like operation
        const updatedBlogs = state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
        state.blogs = updatedBlogs;
      })
      .addCase(likeBlogAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle comment on blog
      .addCase(commentOnBlogAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(commentOnBlogAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex((blog) => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload; // Update blog with new comment
        }
      })
      .addCase(commentOnBlogAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle share blog
      .addCase(shareBlogAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(shareBlogAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex((blog) => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload; // Update blog with new share count
        }
      })
      .addCase(shareBlogAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCommentsAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCommentsAction.fulfilled, (state, action) => {
        state.loading = false;
        const { blogId, comments } = action.payload;
        const blogIndex = state.blogs.findIndex(blog => blog._id === blogId);
        if (blogIndex !== -1) {
          state.blogs[blogIndex].comments = comments;  // Update the comments for the correct blog
        }
      })
      .addCase(getCommentsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
       // Handle the pending state for fetchComments
       .addCase(fetchComments.pending, (state) => {
        state.loading = true;  // Set loading to true when the fetch is in progress
        state.error = null;    // Reset error when fetching starts
      })
      // Handle the fulfilled state for fetchComments (successful response)
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;  // Set loading to false when the fetch is completed
        state.comments = action.payload;  // Set the fetched comments in the state
      })
      // Handle the rejected state for fetchComments (failure)
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;  // Set loading to false when the fetch is completed
        state.error = action.payload || action.error.message; // Set the error message in the state
      });
  },
});
export const { setBlogs, toggleLike, addComment, incrementShareCount } = blogSlice.actions;
export default blogSlice.reducer;
