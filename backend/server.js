import dotenv from "dotenv";
dotenv.config({quiet: true});

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER VERSION 123");
    connectDB();
});