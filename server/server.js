// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import connectDB from "./configs/db.js";
// import { clerkMiddleware } from "@clerk/express";
// import clerkWebhooks from "./controllers/clerkWebHooks.js";

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Enable CORS
// app.use(cors());

// // ===== WEBHOOK ROUTE FIRST =====
// // This must be BEFORE express.json() so we can get raw body for Svix verification
// app.post(
//   "/api/clerk",
//   express.raw({ type: "application/json" }),
//   clerkWebhooks
// );

// // ===== REGULAR MIDDLEWARE =====
// app.use(express.json()); // parse JSON for all other routes
// app.use(clerkMiddleware()); // Clerk auth for protected routes

// // ===== ROUTES =====
// app.get("/", (req, res) => res.send("API is Working"));

// // ===== SERVER START =====
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () =>
//   console.log(`Server is running on port ${PORT}`)
// );























import express from "express"

import "dotenv/config";

import cors from "cors"
import { get } from "mongoose";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebHooks.js";


connectDB()

const app = express();
app.use(cors()) //enable cross-origin resoure sharing
// API to listen clerk webhooks

app.use("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks) 

// middleware 
app.use(express.json()) // parse json data`
app.use(clerkMiddleware()) // clerk middleware for authentication



app.get('/', (req, res) => res.send("API is Working "))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));