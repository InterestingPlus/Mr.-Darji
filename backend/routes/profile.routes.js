import express from "express";

import {
  getPublicProfile,
  getShopProfile,
  updateShopProfile,
} from "../controllers/profile.controller.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/:slug", getPublicProfile);
router.get("/", authenticate, getShopProfile);
router.put("/", authenticate, updateShopProfile);

export default router;
