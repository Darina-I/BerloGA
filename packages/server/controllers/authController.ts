import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateTokens, refreshAccessToken } from "../utils/auth";
import City from "../models/City";

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

    const tokens = generateTokens({ userId: user.id });

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

    const tokens = generateTokens({ userId: user.id });

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
      tokens,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refrash token обязателен" });
    }

    const result = await refreshAccessToken(refreshToken);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
