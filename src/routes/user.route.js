import { Router } from "express";
import {
  getAllUsers,
  registerUser,
  loginUser,
  editUser,
  getUserById
} from "../controllers/user.controller.js";
import { AuthenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();
// user route
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/edit", AuthenticateUser, editUser);
router.get("/profile", AuthenticateUser, getUserById);

export default router;
