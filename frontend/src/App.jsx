import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, clearUser } from './features/authSlice'; // Now importing from authSlice
import Navbar from './components/Navbar'; // Assuming you have a Navbar component
import HomePage from './pages/HomePage'; // Home page component
import LoginPage from './pages/LoginPage'; // SignIn page component
import SignUpPage from './pages/SignUpPage'; // SignUp page component
import ProfilePage from './pages/ProfilePage'; // Profile page component
import Profile from "./components/Profile"
import BlogFeedPage from './pages/BlogFeedPage'; // Blog Feed page component
import CreateBlogPage from './pages/CreateBlogPage'; // Create Blog page component
import UpdateBlogPage from './pages/UpdateBlogPage'; // Update Blog page component
import ProtectedRoute from './components/ProtectedRoute'; // Custom ProtectedRoute component to protect routes

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user from Redux store
  const loading = useSelector((state) => state.auth.loading); // Get loading status from Redux store
  const error = useSelector((state) => state.auth.error); // Get error status from Redux store

  // On initial load, check the authentication status from the localStorage token
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth()); // Dispatch the checkAuth thunk to verify user authentication
    } else {
      dispatch(clearUser()); // If no token, clear user from Redux store
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="app-container">
        {loading ? (
          <div>Loading...</div> // Show a loading state while checking auth
        ) : (
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected Routes (only accessible if authenticated) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs"
              element={
                <ProtectedRoute user={user}>
                  <BlogFeedPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs/create"
              element={
                <ProtectedRoute user={user}>
                  <CreateBlogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs/update/:id"
              element={
                <ProtectedRoute user={user}>
                  <UpdateBlogPage />
                </ProtectedRoute>
              }
            />
            {/* Add more routes as necessary */}
          </Routes>
        )}

        {error && <div className="error-message">{error}</div>} {/* Display error message */}
      </div>
    </>
  );
};

export default App;
