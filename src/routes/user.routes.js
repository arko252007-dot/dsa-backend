import { Router } from "express";
import {
    registerUser,
    loginUser,
    getUserStats,
    toggleSolveProblem,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/solve").post(toggleSolveProblem);
router.route("/:username").get(getUserStats);

export default router;
