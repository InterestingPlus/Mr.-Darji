import express from "express";

import { authenticate } from "../middleware/auth.js";
import { todayStats } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/today", authenticate, todayStats);
export default router;
