import { Router } from "express";
import {
    createTaskSchedule,
    getUserTasks
} from "../controllers/taskSchedule.controller.js";
import { AuthenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/create",AuthenticateUser, createTaskSchedule);
router.get("/all",AuthenticateUser, getUserTasks);



export default router;
