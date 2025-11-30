import express from "express";
import {
  loginUser,
  registerOwnerShop,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register-owner-shop", registerOwnerShop);
router.post("/login", loginUser);

export default router;
