import { createUser, login } from "../Services/UserService.ts";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config.ts";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
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
      { userId: user.id, role: user.role, email: user.email },
      SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      },
    );
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .send({ user, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).send(error.message);
    } else {
      res.status(500).send(error);
    }
  }
};

export const protecteController = async (req: Request, res: Response) => {
  const token = req.cookies.access_token
  if (!token) {
    return res.status(401).send('Unauthorized')
  }

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY)
    //TODO: change this, dont send the data
    res.status(200).send(data)
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).send(error.message)
    } else {
      res.status(500).send(error)
    }
  }

}
