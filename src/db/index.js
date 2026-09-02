import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        console.log(`MongoDB Connected successfully! DB Host: ${connectionInstance.connection.host}`);

        // Drop legacy index from previous schema version to avoid unique constraint conflicts on signup
        try {
            const usersCollection = connectionInstance.connection.collection('users');
            const indexes = await usersCollection.indexes();
            const hasOldIndex = indexes.some(idx => idx.name === 'studentName_1');
            if (hasOldIndex) {
                await usersCollection.dropIndex('studentName_1');
                console.log('Successfully dropped legacy index studentName_1');
            }
        } catch (idxErr) {
            // Collection or index hasn't been created yet
        }
    } catch (error) {
        console.error("MONGODB connection FAILED: ", error);
        process.exit(1);
    }
};

export default connectDB;
