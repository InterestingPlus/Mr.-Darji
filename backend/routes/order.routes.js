import express from "express";
import { authenticate } from "../middleware/auth.js";

import {
  AllOrders,
  CreateOrder,
  OrderInfo,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", authenticate, AllOrders);
router.get("/:order_id", authenticate, OrderInfo);
router.post("/create", authenticate, CreateOrder);

export default router;
