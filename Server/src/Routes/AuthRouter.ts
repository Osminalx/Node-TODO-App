import { Router } from "express";
import {
	createTaskController,
	deleteTaskController,
	getAllUserTasksController,
	getTaskById,
	updateTask,
} from "../Controllers/TasksController";
import {
	logoutController,
	refreshTokenController,
} from "../Controllers/UserController";
import { authMiddleware } from "../Middlewares/AuthMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/logout", logoutController);
router.post("/refresh", refreshTokenController);

// Task routes
router.get("/tasks", getAllUserTasksController);
router.get("/tasks/:taskId", getTaskById);
router.post("/tasks", createTaskController);
router.patch("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTaskController);

export default router;
