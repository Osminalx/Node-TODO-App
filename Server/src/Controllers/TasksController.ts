import type { Request, Response } from "express";
import {
  getTaskById as taskById,
  getTasksByUser,
  createTask,
  editTask,
  deleteTask,
} from "../Services/TaskService";

export const getAllUserTasksController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.session.user.id;
    const tasks = await getTasksByUser(userId);

    res.json({ tasks });
  } catch (error) {
    console.error("Error getting tasks: ", error);
    res.status(500).json({ message: "Error getting tasks" });
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { taskId } = req.params;
    if (!taskId)
      return res.status(400).json({ message: "Task ID is required" });

    const task = await taskById(Number(taskId));
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ task });
  } catch (error) {
    console.error("Error getting task: ", error);
    res.status(500).json({ message: "Error getting task" });
  }
};

export const createTaskController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const newTask = {
      userId: req.session.user.id,
      ...req.body,
    };

    const taskId = await createTask(newTask);
    res.status(201).json({ message: "Task created", taskId });
  } catch (error) {
    console.error("Error creating task: ", error);
    res.status(500).json({ message: "Error creating task" });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { taskId } = req.params;
    if (!taskId)
      return res.status(400).json({ message: "Task ID is required" });

    const updatedTask = await editTask(Number(taskId), req.body);
    res.json({ message: "Task updated", updatedTask });
  } catch (error) {
    console.error("Error updating task: ", error);
    res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTaskController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { taskId } = req.params;
    if (!taskId)
      return res.status(400).json({ message: "Task ID is required" });

    await deleteTask(Number(taskId));

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task: ", error);
    res.status(500).json({ message: "Error deleting task" });
  }
};
