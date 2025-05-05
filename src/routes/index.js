import express from "express";


import { requireAuth } from "../middleware/middlewares.js";

const router = express.Router();
import getPaginationData from "../utils/paginate.js";

import User from "../models/user.js";
import jwt from "jsonwebtoken";



import user from "./user.js"
import auth from "./auth.js"
import product from "./Products.js"

router.use("/auth", auth);
router.use("/user",requireAuth,user);
router.use("/products",product)




export default router;
