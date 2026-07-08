import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateTokens, refreshAccessToken } from "../utils/auth";
import City from "../models/City";

const ACCESS_TOKEN_LIFE: number = 15 * 60 * 1000;
const REFRESH_TOKEN_LIFE: number = 7 * 24 * 60 * 60 * 1000;

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

    res.json({
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
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

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

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.json({ message: "Вы вышли из системы" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при выходе из системы" });
  }
};
