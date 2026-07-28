import express from "express";
import { protectRoute } from "../middlewares/protectRoutes.js";
import { createSession, activeSession, recentSession, joinSession, getSessionById, endSession } from "../controller/session.controller.js";

const sessionRouter = express.Router();


sessionRouter.post("/create", protectRoute, createSession)
sessionRouter.get("/active-session", protectRoute, activeSession)
sessionRouter.get("/recent-session", protectRoute, recentSession)

sessionRouter.get("/:id", protectRoute, getSessionById)
sessionRouter.post("/:id/join", protectRoute, joinSession)
sessionRouter.post("/:id/end", protectRoute, endSession)

export default sessionRouter;