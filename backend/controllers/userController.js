
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

// Sign Up - Register a new user
// Sign Up - Register a new user
export const signUp = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // Create a new user (password will be hashed by the model's pre-save middleware)
      const newUser = new User({
        name,
        email,
        password,  // Password will be hashed by pre-save hook
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Generate a JWT token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
      });
  
      // Send the token in the response
      res.status(201).json({
        message: 'User signed up successfully',
        token, // Send the JWT token
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  

// Sign In - Log in an existing user
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare the password with the stored hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Send the token in the response
    res.status(200).json({
      message: 'User signed in successfully',
      token, // Send the JWT token
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
