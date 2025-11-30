// ssh-add ~/.ssh/id_ed25519

import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import connectDB from "./configs/db.js";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI);

// import { GoogleSheetService } from "./services/GoogleSheetService.js";
// const sheet = new GoogleSheetService();
// Insert example
// await sheet.insert("Customers", [
//   "CUS_001",
//   "Jatin",
//   "9876543210",
//   "Some Address",
//   "30-Jan-2025",
// ]);
// const allOrders = await sheet.read("Customers");
// console.log(allOrders);

app.get("/", (req, res) => {
  res.json({ message: "Mr. Darji, Server is Running" });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Mr. Darji, Server running on port ${PORT}`);
});
