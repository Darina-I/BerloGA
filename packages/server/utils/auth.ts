import jwt, { SignOptions } from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY!;
const ACCESS_TOKEN_LIFE: string = process.env.JWT_ACCESS_TOKEN_LIFE || "15m";
const REFRESH_TOKEN_LIFE: string = process.env.JWT_REFRESH_TOKEN_LIFE || "7d";

interface JWTPayload {
  userId: number;
}
export const generateTokens = (payload: JWTPayload) => {
  const accessToken: string = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_LIFE,
  } as SignOptions);

  const refreshToken: string = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_LIFE,
  } as SignOptions);

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
