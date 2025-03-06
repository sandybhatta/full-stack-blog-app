import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Create the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Pre-save middleware to hash the password before saving the user
userSchema.pre('save', async function (next) {
  // Check if the password is being modified (or if it's a new user)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Proceed to save the user
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare the password entered by the user with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

