import express from "express";
import {
  loginUser,
  registerOwnerShop,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/regiter-owner-shop", registerOwnerShop);
router.post("/login", authenticate, loginUser);

export default router;
