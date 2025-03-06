import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from './routes/blogRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
// import { fetchAndStoreDummyBlogs } from './services/apiService.js';

import connectDB from './config/db.js'; // Import the MongoDB connection function

dotenv.config();  // Load environment variables from .env file

const app = express();

// Connect to MongoDB
connectDB();
// Fetch and store dummy blog posts in the DB (called once on app startup)
// fetchAndStoreDummyBlogs();

// Middleware setup
app.use(express.json());  // Parse incoming JSON requests
const corsOptions = {
    origin: '*',  // Update to match your frontend URL
  };
  app.use(cors(corsOptions));;  // Enable Cross-Origin Resource Sharing

// Routes setup
app.use('/api/blogs', blogRoutes);  // Blog-related routes
app.use('/api/auth', authRoutes);  // Authentication-related routes

// Error handling middleware (global)
app.use(errorHandler);  // Handles errors for all routes

export default app;  // Export app to be used in server.js
