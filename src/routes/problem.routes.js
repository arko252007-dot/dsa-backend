import { Router } from "express";
import {
    getAllProblems,
    seedProblems,
    deleteAllProblems,
    deleteProblemById,
} from "../controllers/problem.controller.js";

const router = Router();

router.route("/").get(getAllProblems).delete(deleteAllProblems);
router.route("/seed").post(seedProblems);
router.route("/:problemId").delete(deleteProblemById);

export default router;
