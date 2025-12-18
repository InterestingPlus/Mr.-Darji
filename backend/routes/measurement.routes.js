import express from "express";

import { authenticate } from "../middleware/auth.js";
import {
  AddMeasurement,
  GetMeasurement,
  AllMeasurements,
  UpdateMeasurement,
} from "../controllers/measurement.controller.js";

const router = express.Router();

router.get("/", authenticate, AllMeasurements);
router.put("/:measurement_id", authenticate, GetMeasurement);
router.post("/add", authenticate, AddMeasurement);
router.put("/:measurement_id", authenticate, UpdateMeasurement);

export default router;
