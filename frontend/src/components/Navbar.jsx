import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../features/authSlice';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/signin'); // Redirect to login after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          BlogApp
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link> {/* Home route */}
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profile">Profile</Link> {/* Profile route */}
              </li>
              <li>
                <Link to="/blogs">Blog Feed</Link> {/* Blog Feed route */}
              </li>
              <li>
                <Link to="/blogs/create">Create Blog</Link> {/* Create Blog route */}
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signin">Login</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
