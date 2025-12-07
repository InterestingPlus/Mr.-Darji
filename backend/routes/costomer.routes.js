import express from "express";
import {
  AddCustomer,
  CustomerProfile,
  AllCustomers,
} from "../controllers/customer.controller.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, AllCustomers);
router.get("/:customer_id", authenticate, CustomerProfile);
router.post("/add", authenticate, AddCustomer);

export default router;
