// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
    // Log the error (for development)
    console.error(err);
  
    // Handle different types of errors and send appropriate responses
    if (err.name === 'ValidationError') {
      // Handle validation errors (e.g., mongoose validation errors)
      return res.status(400).json({
        msg: 'Validation error',
        errors: Object.values(err.errors).map((val) => val.message),
      });
    }
  
    if (err.name === 'JsonWebTokenError') {
      // Handle JWT errors (invalid token)
      return res.status(401).json({ msg: 'Invalid token, authorization denied' });
    }
  
    if (err.name === 'TokenExpiredError') {
      // Handle expired JWT errors
      return res.status(401).json({ msg: 'Token has expired' });
    }
  
    // Handle other errors (e.g., database errors, general server errors)
    return res.status(500).json({
      msg: 'Server error',
      error: err.message || 'An unknown error occurred',
    });
  };
  