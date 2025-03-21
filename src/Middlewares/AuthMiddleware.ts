import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config";
import type { publicUser } from "../models/user";

declare global {
	namespace Express {
		interface Request {
			session?: { user: publicUser | null };
		}
	}
}

export const authMiddleware = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	const token = req.cookies?.access_token;

	req.session = { user: null };

	if (token) {
		try {
			const data = jwt.verify(token, SECRET_JWT_KEY);
			req.session.user = data as publicUser;
		} catch (error) {
			console.error("Invalid Token", error);
		}
	}

	next();
};
