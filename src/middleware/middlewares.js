import jwt from "jsonwebtoken";
import User from "../models/user.js";

// 1. Basic Middleware Example - Logging
// Demonstrates how middleware can intercept and log requests
const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Always call next() to pass control to the next middleware
};

// 2. Error Handling Middleware
// Shows how to handle errors in a centralized way
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
};

// 3. Authentication Middleware
// Demonstrates basic JWT token verification
const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    verify(token, "secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.json({ message: "😱 - You need to login first" });
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    verify(token, "secret", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  };
};

// 5. Request Validation Middleware
// Demonstrates how to validate request data
const validateUserData = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  next();
};

// 6. Response Time Middleware
// Shows how to measure and log response times
const responseTime = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`Request to ${req.url} took ${duration}ms`);
  });

  next();
};

export {
  requestLogger,
  errorHandler,
  requireAuth,
  validateUserData,
  responseTime,
};
