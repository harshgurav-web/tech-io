import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";
import { clerkMiddleware } from '@clerk/express'
import { protectRoute } from "./middlewares/protectRoutes.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

const handler = serve({
  client: inngest,
  functions,
});

app.use(clerkMiddleware())
app.get("/api/inngest", handler);
app.post("/api/inngest", handler);
app.put("/api/inngest", handler);

//chat routes
app.get( "/api/chats", chatRouter)


app.get("/video-calls", protectRoute, (req,res)=>{
 res.status(200).json({message:"Video calls endpoint protected by clerk"})
})

app.get("/api/test", (req, res) => {
  res.send("API is working");
});

app.get("/", (req, res) => {
  res.send("OK");
});

export default app;