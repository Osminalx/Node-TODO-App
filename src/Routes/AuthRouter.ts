import { Router } from "express";
import {
  logoutController,
  refreshTokenController,
} from "../Controllers/UserController";
import { authMiddleware } from "../Middlewares/AuthMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/logout", logoutController);
router.post("/refresh", refreshTokenController);

export default router;
