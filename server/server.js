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

// Connect to DB (only once)
connectDB();

const app = express();
app.use(cors());

// Clerk webhook must use raw body for Svix verification
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// Normal middleware
app.use(express.json());
app.use(clerkMiddleware());

// Mount API routers
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);

// Health check route
app.get("/", (req, res) => res.send("API is Working 🚀"));

// ❌ No app.listen() here — Vercel handles this
export default app;
