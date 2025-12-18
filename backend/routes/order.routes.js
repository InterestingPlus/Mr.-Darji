import express from "express";
import { authenticate } from "../middleware/auth.js";

import {
  AllOrders,
  CreateOrder,
  OrderInfo,
  UpdatePayment,
  UpdateStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", authenticate, AllOrders);
router.get("/:order_id", authenticate, OrderInfo);
router.post("/create", authenticate, CreateOrder);

router.put("/status/:order_id", authenticate, UpdateStatus);
router.put("/payment/:order_id", authenticate, UpdatePayment);

export default router;
