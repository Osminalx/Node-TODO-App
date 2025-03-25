import { PrismaClient, Prisma } from "@prisma/client";
import { parse } from "valibot";
import { taskSchema, updateTaskSchema } from "../Models/task";

const prisma = new PrismaClient();

export const createTask = async (input: unknown) => {
  try {
    console.log("Input: ", input);
    console.log("DueDate: ", typeof input.dueDate);
    const validatedData = parse(taskSchema, input);

    const newTask = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        dueDate: new Date(validatedData.dueDate).toISOString(),
        userId: validatedData.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log("new task: ", newTask);
    return newTask.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error", error.message);
    } else {
      console.error("Unkown error: ", error);
    }

    throw new Error("Could not delete task");
  }
};

export const getTasksByUser = async (userId: number) => {
  try {
    const tasks = prisma.task.findMany({
      where: {
        userId: userId,
      },
    });
    return tasks;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error", error.message);
    } else {
      console.error("Unkown error: ", error);
    }

    throw new Error("Could not get tasks");
  }
};

export const getTaskById = async (taskId: number) => {
  try {
    const task = prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    return task;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error", error.message);
    } else {
      console.error("Unkown error: ", error);
    }

    throw new Error("Could not get task");
  }
};

export const editTask = async (taskId: number, input: unknown) => {
  try {
    const validatedData = parse(updateTaskSchema, input);
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });
    return updatedTask;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error", error.message);
    } else {
      console.error("Unkown error: ", error);
    }

    throw new Error("Could not update task");
  }
};

export const deleteTask = async (taskId: number) => {
  try {
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });
    return { message: "Task deleted correctly" };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error", error.message);
    } else {
      console.error("Unkown error: ", error);
    }

    throw new Error("Could not delete task");
  }
};
