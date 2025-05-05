import winston from "winston";
import express from "express";
// import getPaginationData from "../middleware/getPaginationData.js";
import getPaginationData from "../utils/paginate.js"
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import auth from "./auth.js";

const router = express.Router();
import { requireAuth } from "../middleware/middlewares.js";



// Get a user by email
// This route retrieves a user by their email address
router.get("/getbyemail/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Check if user exists in the db
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user exists
    return res.json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ error: errors });
  }
});

  // Get all users
  router.get("/", async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const { currentPage, itemsPerPage, skip, totalPages } = getPaginationData(
        req.query.page,
        req.query.limit,
        totalUsers
      );
  
      const users = await User.find().skip(skip).limit(itemsPerPage);
  
      return res.json({
        message: "Users retrieved successfully",
        currentPage,
        totalPages,
        totalUsers,
        users,
      });
    } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({ errors });
    }
  });
  // Create a new user
  router.post("/", async (req, res) => {
    const { name, email, password } = req.body;
  
    const user = new User({ name, email, password });
    try {
      const savedUser = await user.save();
      return res.json({ message: savedUser });
    } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({ errors });
    }
  });
  // Update a user
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(id, {
        name,
        email,
        password,
      });
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({ errors });
    }
  });
  

  // Delete a user
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({
        message: "User deleted successfully",
        user: deletedUser,
      });
    } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({ errors });
    }
  });
  
  router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.create({ email, password });
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  });
  
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      console.log(token);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  });
  
  router.get("/logout", () => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
  });
  
  // handle errors
  const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: "", password: "" };
  
    // incorrect email
    if (err.message === "incorrect email") {
      errors.email = "That email is not registered";
    }
  
    // incorrect password
    if (err.message === "incorrect password") {
      errors.password = "That password is incorrect";
    }
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = "that email is already registered";
      return errors;
    }
  
    // validation errors
    if (err.message.includes("user validation failed")) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  };
  
  // create json web token
  const maxAge = 3 * 24 * 60 * 60;
  const createToken = (id) => {
    return jwt.sign({ id }, "secret", {
      expiresIn: maxAge,
    });
  };


  
  // module.exports = router;
  export default router;
