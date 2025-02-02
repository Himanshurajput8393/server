import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import "./config/database.js"; // import database connection
import { authRouter } from "./router/authRouter.js";
import cookieParser from "cookie-parser";


const app = express();

dotenv.config({ path: "./config/.env" });

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/", authRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running port no ${PORT}`);
});
