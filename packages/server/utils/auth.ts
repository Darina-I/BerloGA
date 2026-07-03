import jwt, { SignOptions } from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY!;

interface JWTPayload {
  userId: number;
}

export const generateTokens = (payload: JWTPayload) => {
  if (typeof payload.userId !== "number" || Number.isNaN(payload.userId)) {
    throw new Error("generateTokens: payload.userId must be a valid number");
  }
  const accessToken: string = jwt.sign(payload, JWT_SECRET_KEY);

  const refreshToken: string = jwt.sign(payload, JWT_SECRET_KEY);

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expires access token");
  }
};

const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expires refresh token");
  }
};

export const refreshAccessToken = (refreshToken: string) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const { accessToken } = generateTokens(payload);
    return { newAccessToken: accessToken };
  } catch (error) {
    throw error;
  }
};
