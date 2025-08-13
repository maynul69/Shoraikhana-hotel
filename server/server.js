import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebHooks.js";

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// ===== WEBHOOK ROUTE (raw body) =====
// This must be before express.json() and any other middleware that parses the body
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }), // raw body for Svix verification
  clerkWebhooks
);

// ===== NORMAL MIDDLEWARE =====
app.use(express.json()); // parse JSON for normal routes
app.use(clerkMiddleware()); // Clerk auth middleware for protected routes

// ===== ROUTES =====
app.get("/", (req, res) => res.send("API is Working"));

// ===== SERVER START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));






















// import express from "express"

// import "dotenv/config";

// import cors from "cors"
// import { get } from "mongoose";
// import connectDB from "./configs/db.js";
// import { clerkMiddleware } from '@clerk/express'
// import clerkWebhooks from "./controllers/clerkWebHooks.js";


// connectDB()

// const app = express();
// app.use(cors()) //enable cross-origin resoure sharing

// // middleware 
// app.use(express.json()) // parse json data`
// app.use(clerkMiddleware()) // clerk middleware for authentication

// // API to listen clerk webhooks

// app.use("/api/clerk", clerkWebhooks);

// app.get('/', (req, res) => res.send("API is Working "))

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));