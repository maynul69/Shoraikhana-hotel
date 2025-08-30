import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebHooks.js";

import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Connect to DB once
connectDB();

const app = express();
app.use(cors());

// Clerk webhook
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// Middlewares
app.use(express.json());
app.use(clerkMiddleware());

// API routes
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);

// Health check
app.get("/", (req, res) => res.send("API is Working 🚀"));

// 🔹 Export as handler for Vercel
const handler = (req, res) => app(req, res);
export default handler;
