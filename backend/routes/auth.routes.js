import express from "express";
import {
  googleLogin,
  loginUser,
  registerOwnerShop,
} from "../controllers/auth.controller.js";
// import GoogleAuth from "../configs/googleAuth.js";

const router = express.Router();

router.post("/register-owner-shop", registerOwnerShop);
router.post("/login", loginUser);
router.post("/google", googleLogin);

export default router;
