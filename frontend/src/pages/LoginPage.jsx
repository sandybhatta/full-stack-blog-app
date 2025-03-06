import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signinUser } from "../services/api"; // API function for sign-in
import { setUser, setError } from "../features/userSlice"; // Redux actions
import { useNavigate } from "react-router-dom";
import "../assets/styles/LoginPage.css"; // Import CSS for styling

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signinUser({ email, password }); // Call API
      if (response.token) {
        dispatch(setUser({ user: response.user, token: response.token })); // Store user data in Redux
        localStorage.setItem("token", response.token);
        dispatch(setError(null)); // Clear any previous error
        navigate("/"); // Redirect to profile page after login
      }
    } catch (err) {
      console.log("Login failed", err);
      const errorMsg =
        err?.response?.status === 400
          ? "User not found. Please sign up first."
          : err?.response?.data?.msg || "Invalid credentials";
      dispatch(setError(errorMsg));
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>} {/* Display error if any */}
        <button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <p>
        Not a user?{" "}
        <span onClick={() => navigate("/signup")} className="signup-link">
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
