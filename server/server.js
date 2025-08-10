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

// middleware 
app.use(express.json()) // parse json data`
app.use(clerkMiddleware()) // clerk middleware for authentication

// API to listen clerk webhooks

app.use("/api/clerk", clerkWebhooks);

app.get('/', (req, res) => res.send("API is Working "))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));