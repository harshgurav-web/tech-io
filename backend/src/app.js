import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

const handler = serve({
  client: inngest,
  functions,
});

app.get("/api/inngest", handler);
app.post("/api/inngest", handler);
app.put("/api/inngest", handler);

app.get("/api/test", (req, res) => {
  res.send("API is working");
});

app.get("/", (req, res) => {
  res.send("OK");
});

export default app;