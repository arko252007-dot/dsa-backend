import mongoose, { Schema } from "mongoose";

const problemSchema = new Schema(
    {
        problemId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            index: true,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "easy",
            index: true,
        },
        practiceUrl: {
            type: String,
            default: "https://leetcode.com",
        },
        hint: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export const Problem = mongoose.model("Problem", problemSchema);
