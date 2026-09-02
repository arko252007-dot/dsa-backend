import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !username.trim()) {
        throw new ApiError(400, "Username is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const trimmedUsername = username.trim();

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

    const existingUser = await User.findOne({ username: trimmedUsername });
    if (existingUser) {
        throw new ApiError(409, `Username '${trimmedUsername}' is already taken. Please choose another username or log in.`);
    }

    try {
        const newUser = await User.create({
            username: trimmedUsername,
            password: password,
            solvedProblems: [],
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    username: newUser.username,
                    solvedCount: 0,
                    solvedProblems: {},
                },
                "Account registered successfully!"
            )
        );
    } catch (err) {
        if (err.code === 11000) {
            // Drop stale index if lingering from an older schema version
            try {
                await User.collection.dropIndex("studentName_1");
            } catch (e) {}
            throw new ApiError(409, `Username '${trimmedUsername}' is already taken. Please choose another username or log in.`);
        }
        throw err;
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !username.trim()) {
        throw new ApiError(400, "Username is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const trimmedUsername = username.trim();

    const user = await User.findOne({ username: trimmedUsername });

    if (!user) {
        throw new ApiError(404, `User '${trimmedUsername}' not found. Please sign up for a new account.`);
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if (!isPasswordValid) {
        // Upgrade legacy plaintext passwords on first successful login
        if (user.password === password) {
            user.password = password;
            await user.save();
        } else {
            throw new ApiError(401, "Incorrect password. Please try again.");
        }
    }

    const solvedMap = {};
    if (Array.isArray(user.solvedProblems)) {
        user.solvedProblems.forEach((sp) => {
            solvedMap[sp.problemId] = sp.solvedAt;
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                username: user.username,
                solvedCount: user.solvedProblems ? user.solvedProblems.length : 0,
                solvedProblems: solvedMap,
            },
            "Logged in successfully"
        )
    );
});

const getUserStats = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username) {
        throw new ApiError(400, "Username parameter is required");
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const solvedMap = {};
    if (Array.isArray(user.solvedProblems)) {
        user.solvedProblems.forEach((sp) => {
            solvedMap[sp.problemId] = sp.solvedAt;
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                username: user.username,
                solvedCount: user.solvedProblems ? user.solvedProblems.length : 0,
                solvedProblems: solvedMap,
            },
            "User stats fetched successfully"
        )
    );
});

const toggleSolveProblem = asyncHandler(async (req, res) => {
    const { username, problemId, isSolved } = req.body;

    if (!username || !problemId) {
        throw new ApiError(400, "username and problemId are required");
    }

    let user = await User.findOne({ username: username.trim() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!Array.isArray(user.solvedProblems)) {
        user.solvedProblems = [];
    }

    const problemIndex = user.solvedProblems.findIndex(
        (sp) => sp.problemId === problemId
    );

    if (isSolved) {
        if (problemIndex === -1) {
            user.solvedProblems.push({
                problemId,
                solvedAt: new Date(),
            });
        }
    } else {
        if (problemIndex !== -1) {
            user.solvedProblems.splice(problemIndex, 1);
        }
    }

    await user.save();

    const solvedMap = {};
    user.solvedProblems.forEach((sp) => {
        solvedMap[sp.problemId] = sp.solvedAt;
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                username: user.username,
                problemId,
                isSolved,
                totalSolved: user.solvedProblems.length,
                solvedProblems: solvedMap,
            },
            "Problem solved status updated in DB"
        )
    );
});

export { registerUser, loginUser, getUserStats, toggleSolveProblem };
