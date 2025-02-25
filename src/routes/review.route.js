import { Router } from "express";
import { addreview } from "../controllers/review.controller.js";
import { AuthenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add",AuthenticateUser,addreview);

export default router;