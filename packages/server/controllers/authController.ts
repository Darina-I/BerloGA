import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateTokens, refreshAccessToken } from "../utils/auth";
import City from "../models/City";

const ACCESS_TOKEN_LIFE: number = 15 * 60 * 1000;
const REFRESH_TOKEN_LIFE: number = 7 * 24 * 60 * 60 * 1000;

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nickname, password]
 *             properties:
 *               nickname: {type: string, minLength: 3, example: "example_user"}
 *               password: {type: string, format: password, example: "secret123"}
 *     responses:
 *       '201':
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: {type: string}
 *                 user: {$ref: '#/components/schemas/User'}
 *       '400': { description: Пользователь с таким никнеймом уже существует}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { nickname, password } = req.body;

    const existingUser = await User.findOne({ where: { nickname } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким никнеймом уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nickname,
      password: hashedPassword,
      role: "user",
    });

    const tokens = generateTokens({ userId: user.id, role: user.role });

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
      },
      tokens,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя (логин)
 *     description: |
 *       При успешном входе сервер устанавливает HTTP-only куки:
 *       - `access_token` (живет 15 мин)
 *       - `refresh_token` (живет 7 дней)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nickname, password]
 *             properties:
 *               nickname: {type: string, example: "example_user"}
 *               password: {type: string, format: password, example: "secret123"}
 *     responses:
 *       '200':
 *         description: Авторизация успешна, куки установлены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: {type: string}
 *                 user: {$ref: '#/components/schemas/User'}
 *       '401': {description: Неверный никнейм или пароль}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { nickname, password } = req.body;

    const user = await User.findOne({
      where: { nickname },
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Неверный никнейм или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Неверный никнейм или пароль" });
    }

    const tokens = generateTokens({ userId: user.id, role: user.role });

    res.cookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax", // Отправляй эту куку на сервер только в безопасных ситуациях, но не в подозрительных межсайтовых запросах
      maxAge: ACCESS_TOKEN_LIFE,
    });

    res.cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_LIFE, // 7 days
    });

    const response = {
      message: "Авторизация успешна",
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user?.email,
        city: user?.city,
        social_network: user?.social_network,
        is_show_city: user.is_show_city,
        role: user.role,
      },
      access_token: "",
    };

    if (process.env.NODE_ENV === "development") {
      response.access_token = tokens.accessToken;
    }

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновить Access Token по Refresh Token
 *     tags: [Auth]
 *     responses:
 *       '200':
 *         description: Access Token успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: {type: string}
 *       '400': { description: Refresh token отсутствует в куках}
 *       '500': { description: Invalid refresh token или ошибка сервера}
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token обязателен" });
    }

    const { newAccessToken } = await refreshAccessToken(refreshToken);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_LIFE,
    });

    res.json({ message: "Access token обновлен" });
  } catch (error) {
    console.log("Refresh error", error);
    res.status(500).json({ message: "Invalid refresh token" });
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выход из системы
 *     description: |
 *       Сервер удаляет куки access_token и refresh_token.
 *       После этого сессия пользователя завершается.
 *     tags: [Auth]
 *     responses:
 *       '200': {description: Успешный выход, куки удалены}
 *       '500': {description: Ошибка при выходе}
 */
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.json({ message: "Вы вышли из системы" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при выходе из системы" });
  }
};
