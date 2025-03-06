import app from './app.js';  // Import the Express app from app.js
import dotenv from 'dotenv';
import colors from 'colors';  // For logging with colors

dotenv.config();  // Load environment variables

const PORT = process.env.PORT ;  // Default to 5000 if not set in .env

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.green.bold);
});
