import dotenv from "dotenv";
dotenv.config({quiet: true});

import app from "./src/app.js";
import connectDB from "./src/lib/db.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Server failed to start:", err);
    }
};

startServer();