import type { Request, Response } from "express";

export const protecteController = async (req: Request, res: Response) => {
	try {
		res.status(200);
	} catch (error) {
		if (error instanceof Error) {
			res.status(401).send(error.message);
		} else {
			res.status(500).send(error);
		}
	}
};
