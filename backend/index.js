// ssh-add ~/.ssh/id_ed25519

import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import connectDB from "./configs/db.js";

import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/costomer.routes.js";
import orderRoutes from "./routes/order.routes.js";
import serviceRoutes from "./routes/services.routes.js";
import measurementRoutes from "./routes/measurement.routes.js";
import shopRoutes from "./routes/profile.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

import job from "./services/cron.js";

dotenv.config();
const app = express();

job.start();

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.get("/", (req, res) => {
  res.json({ message: "Mr. Darji, Server is Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/measurement", measurementRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/profile", shopRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Mr. Darji, Server running on port ${PORT}`);
});
