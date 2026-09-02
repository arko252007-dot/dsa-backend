import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Problem } from "../models/problem.model.js";

const getAllProblems = asyncHandler(async (req, res) => {
    const { category, difficulty, search } = req.query;

    const filter = {};

    if (category && category !== "all") {
        filter.category = category;
    }

    if (difficulty && difficulty !== "all") {
        filter.difficulty = difficulty.toLowerCase();
    }

    if (search && search.trim() !== "") {
        filter.title = { $regex: search.trim(), $options: "i" };
    }

    const problems = await Problem.find(filter).sort({ _id: 1 });

    return res.status(200).json(
        new ApiResponse(200, problems, "Problems fetched successfully")
    );
});

const seedProblems = asyncHandler(async (req, res) => {
    const rawProblems = Array.isArray(req.body) ? req.body : req.body.problems;

    if (!Array.isArray(rawProblems) || rawProblems.length === 0) {
        return res.status(400).json(
            new ApiResponse(400, null, "Array of problems is required to seed")
        );
    }

    const problems = rawProblems;

    // Upsert by problemId so repeated seed operations remain idempotent
    const bulkOps = problems.map((prob) => ({
        updateOne: {
            filter: { problemId: prob.id || prob.problemId },
            update: {
                $set: {
                    problemId: prob.id || prob.problemId,
                    title: prob.title,
                    category: prob.category,
                    difficulty: (prob.difficulty || "easy").toLowerCase(),
                    practiceUrl: prob.practiceUrl || "https://leetcode.com",
                    hint: prob.hint || "",
                },
            },
            upsert: true,
        },
    }));

    await Problem.bulkWrite(bulkOps);

    const total = await Problem.countDocuments();

    return res.status(200).json(
        new ApiResponse(200, { totalInDatabase: total }, "Problems seeded successfully")
    );
});

const deleteAllProblems = asyncHandler(async (req, res) => {
    const result = await Problem.deleteMany({});

    return res.status(200).json(
        new ApiResponse(200, { deletedCount: result.deletedCount }, "All problems deleted successfully")
    );
});

const deleteProblemById = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    const problem = await Problem.findOneAndDelete({ problemId });

    if (!problem) {
        return res.status(404).json(
            new ApiResponse(404, null, `Problem with ID '${problemId}' not found`)
        );
    }

    return res.status(200).json(
        new ApiResponse(200, problem, "Problem deleted successfully")
    );
});

export { getAllProblems, seedProblems, deleteAllProblems, deleteProblemById };
