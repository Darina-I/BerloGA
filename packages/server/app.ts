import dotenv from "dotenv";
import express from "express";
import { sequelize, testConnection } from "./db";
import genreRoutes from "./routes/genre";

dotenv.config();

const app = express();

app.use(express.json());

async function initializeApp() {
  await testConnection();
  await sequelize.sync({ force: false }); //не пересоздает таблицы в бд
  console.log("Таблицы синхронизированы");
}

initializeApp().catch(console.error);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

//подключение роутов
app.use("/api", genreRoutes);

export default app;
