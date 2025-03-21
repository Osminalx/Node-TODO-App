import { Router } from "express";
import {
	logoutController,
	refreshTokenController,
} from "../Controllers/UserController.ts";
import { authMiddleware } from "../Middlewares/AuthMiddleware.ts";

const router = Router();

router.use(authMiddleware);

router.post("/refresh", refreshTokenController);
router.post("/logout", logoutController);

export default router;
