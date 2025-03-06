import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/authSlice'; // Adjust the import path as needed
import { Link } from 'react-router-dom';  // Use Link for navigation
import "../assets/styles/SignUpPage.css";  // Assuming you have a CSS file for styles

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous errors before making a request

    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token in localStorage
        localStorage.setItem('token', data.token);
        
        // Set the user in redux state (if using redux for user state management)
        dispatch(setUser(data.user)); // Assuming user data is returned in the response

        // Navigate to the home page or wherever needed
        navigate('/');
      } else {
        setError(data.message || 'Something went wrong!');
      }
    } catch (error) {
      setError('Error during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <div className="signin-link">
        <p>Already have an account? <Link to="/signin">Sign In</Link></p> {/* Changed to Link */}
      </div>
    </div>
  );
};

export default SignUpPage;
