import {
  createUser,
  getUserById,
  login,
  updateRefreshToken,
} from "../Services/UserService.ts";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config.ts";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send(error);
    }
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const user = await login(req.body);
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      },
    );

    const refreshToken = jwt.sign({ userId: user.id }, SECRET_JWT_KEY, {
      expiresIn: "7d",
    });

    await updateRefreshToken(user.id, refreshToken);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .send({ user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).send(error.message);
    } else {
      res.status(500).send(error);
    }
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, SECRET_JWT_KEY) as {
      userId: number;
    };
    const user = await getUserById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      SECRET_JWT_KEY,
      { expiresIn: "1h" },
    );

    res
      .cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hora
      })
      .json({ message: "Successfully refreshed token" });
  } catch (error) {
    console.error("Error refreshing token: " + error);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    const decoded = jwt.verify(refreshToken, SECRET_JWT_KEY) as {
      userId: number;
    };
    await updateRefreshToken(decoded.userId, null);

    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .json({ message: "Logout successful" });
  } catch (error) {
    console.error("logout Error: ", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
