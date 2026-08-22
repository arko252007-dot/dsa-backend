import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
    })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes Declaration (Direct clean routes: /users, /problems)
import userRouter from "./routes/user.routes.js";
import problemRouter from "./routes/problem.routes.js";

app.use("/users", userRouter);
app.use("/problems", problemRouter);

// Health check endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "DSA with C Platform Backend API is running smoothly!",
        routes: {
            users: "/users",
            problems: "/problems",
        },
    });
});

// Global Error Handler
app.use(errorHandler);

export { app };
