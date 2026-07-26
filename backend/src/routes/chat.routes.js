import express from "express";
import { protectRoute } from "../middlewares/protectRoutes.js";
import { createStreamToken } from "../controller/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/get-token", protectRoute, createStreamToken);

export default chatRouter;