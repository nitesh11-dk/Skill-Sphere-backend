import { Router } from "express";
import {
  updateUserSkills
} from "../controllers/skills.controller.js";
import { AuthenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/add",AuthenticateUser, updateUserSkills);



export default router;
