import dotenv from "dotenv";
import express from "express";
import { sequelize } from "./db";
import "./models";
import "./models/associations";

//роутеры

import blockCommentRouter from "./routes/blockComment";
import boardgameRouter from "./routes/boardgame";
import cityRouter from "./routes/city";
import commentRouter from "./routes/comment";
import complaintRouter from "./routes/complaint";
import genreRouter from "./routes/genre";
import makerRouter from "./routes/maker";
import requestRouter from "./routes/request";
import userRouter from "./routes/user";

dotenv.config();

const app = express();

app.use(express.json());

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
app.use("/api", boardgameRouter);
app.use("/api", cityRouter);
app.use("/api", commentRouter);
app.use("/api", complaintRouter);
app.use("/api", genreRouter);
app.use("/api", makerRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);

export default app;
