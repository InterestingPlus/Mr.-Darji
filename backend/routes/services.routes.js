import express from "express";

import { authenticate } from "../middleware/auth.js";
import {
  AddService,
  AllServices,
  UpdateService,
} from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", authenticate, AllServices);
router.post("/", authenticate, AddService);
router.put("/:service_id", authenticate, UpdateService);

export default router;
