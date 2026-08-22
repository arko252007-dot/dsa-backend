import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 8000;

// Connect to MongoDB and start Express server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server connected`);
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed !!! ", err);
    });
