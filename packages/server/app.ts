import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { sequelize } from "./db";
import "./models";
import "./models/associations";

import blockCommentRouter from "./routes/blockComment";
import boardgameRouter from "./routes/boardgame";
import cityRouter from "./routes/city";
import commentRouter from "./routes/comment";
import complaintRouter from "./routes/complaint";
import genreRouter from "./routes/genre";
import makerRouter from "./routes/maker";
import requestRouter from "./routes/request";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

async function initializeApp() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false, alter: true });
    console.log("Таблицы синхронизированы");
  } catch (error) {
    console.error("❌ Ошибка синхронизации:", error);
  }
}

initializeApp();

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

//подключение роутов
app.use("/api", blockCommentRouter);
app.use("/api/boardgames", boardgameRouter);
app.use("/api/cities", cityRouter);
app.use("/api/comments", commentRouter);
app.use("/api/complaints", complaintRouter);
app.use("/api/genres", genreRouter);
app.use("/api/makers", makerRouter);
app.use("/api/requests", requestRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

export default app;
