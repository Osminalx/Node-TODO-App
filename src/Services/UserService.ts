import { Prisma, PrismaClient } from "@prisma/client";
import { authSchema, type publicUser, Role } from "../models/user.ts";
import { parse } from "valibot";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config";

const prisma = new PrismaClient();

export const createUser = async (input: unknown) => {
	try {
		const validatedData = parse(authSchema, input);

		const hashedPassword = await bcrypt.hash(
			validatedData.password,
			SALT_ROUNDS,
		);

		console.log(input);

		const user = await prisma.user.create({
			data: {
				email: validatedData.email,
				password: hashedPassword,
				role: Role.USER,
			},
		});
		console.log("new user ${user}");
		return user.id;
	} catch (error) {
		console.error("Error en createUser" + error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				throw new Error("Email already exists");
			}
		}
		throw new Error("Error creating user");
	}
};

export const login = async (input: unknown) => {
	const validatedData = parse(authSchema, input);

	const user = await prisma.user.findUniqueOrThrow({
		where: {
			email: validatedData.email,
		},
	});

	const publicUser: publicUser = {
		id: user.id,
		email: user.email,
		role: validatedData.role,
	};

	const isPasswordValid = await bcrypt.compare(
		validatedData.password,
		user.password,
	);

	if (!isPasswordValid) throw new Error("Invalid password");

	return publicUser;
};
