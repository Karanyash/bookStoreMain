import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 4000;
// const URI = process.env.MongoDBURI;
const URI = process.env.MONGO_ONLINE_URL;

// connect to mongoDB
try {
    mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to mongoDB");
} catch (error) {
    console.log("Error: ", error);
}

// defining routes
app.use("/book", bookRoute);
app.use("/user", userRoute);

// Deployment
if (process.env.NODE_ENV === "production") {
    const dirPath = path.resolve();
    app.use(express.static(path.join(__dirname, '../Frontend/dist')));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(dirPath, "Frontend", "dist", "index.html"));
    });
}

app.get("/", (req, res) => {
    app.use(express.static(path.join(__dirname, '../Frontend/dist')));
    res.sendFile(path.resolve(__dirname, "../Frontend/dist/index.html"));
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});