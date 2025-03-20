import { PrismaClient } from "@prisma/client";
import { Task, taskSchema } from "../models/task.ts";
import { parse } from "valibot";

const prisma = new PrismaClient();

export const createTask = async (input: unknown) => {
	try {
		const validatedData = parse(taskSchema, input);

		const newTask = await prisma.task.create({
			data: {
				title: validatedData.title,
				description: validatedData.description,
				dueDate: validatedData.dueDate,
				userId: validatedData.userId,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});
		console.log("new task: ", newTask);
		return newTask.id;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error("Error creating task");
		}
	}
};

//TODO: Fix service and check how to add auth
export const getTasksByUser = async (userId: number) => {
	try {
		const tasks: Task[] = prisma.task.findMany({
			where: {
				userId: userId,
			},
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
		}
	}
};
