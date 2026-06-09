import { Sequelize } from "sequelize";

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env;

if (
  !POSTGRES_USER ||
  !POSTGRES_PASSWORD ||
  !POSTGRES_HOST ||
  !POSTGRES_PORT ||
  !POSTGRES_DB
) {
  throw new Error("Не все переменные окружения PostgreSQL заданы в .env файле");
}

const databaseUrl = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
});

export async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("✅ Успешное подключение к базе данных BerloGA");
  } catch (error) {
    console.error(
      "❌ Ошибка подключения к базе данных:",
      (error as Error).message,
    );
    process.exit(1);
  }
}
