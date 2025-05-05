import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

import User from "../models/user.js";
import handleErrors from "../utils/errorHandler.js";
import { sendWelcomeEmail } from "../utils/mailer.js";

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
const createToken = (id, role) => {
    return jwt.sign({ id, role }, "secret", {
        expiresIn: maxAge,
    });
};

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password, res);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
});

router.post("/signup", async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const user = await User.create({ email, password, name });
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

        // Send welcome email
        await sendWelcomeEmail(email, name);

        res.status(201).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
});

router.post("/logout", (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "Logged out" });
});

router.get("/logout", (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
});

export default router;