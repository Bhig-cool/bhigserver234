/**
 * @fileoverview Main Express application setup and configuration
 * @module app
 */

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json } from "express";
import helmet from "helmet";
import morgan from "morgan";

import dotenv from "dotenv";
import { errorHandler } from "./middleware/middlewares.js";
import api from "./routes/index.js";

// Load environment variables from .env file
dotenv.config();

/**
 * Express application instance
 * @type {import('express').Application}
 */
const app = express();

// Enable CORS for all routes
app.use(cors());

// Log HTTP requests in development mode
app.use(morgan("dev"));

// Add security headers
app.use(helmet());

// Parse JSON request bodies
app.use(json());

// Parse cookies from request headers
app.use(cookieParser());


app.get("/", (req, res) => {
  res.json({
    status: "server currently running",
    time: new Date().toISOString(),
  });
});


app.use("/api/v1", api);

app.use("*", (req, res) => {
  res.status(404).json({
    message: "Resource not found",
  });
});

// Global error handler
app.use(errorHandler);

export default app;
