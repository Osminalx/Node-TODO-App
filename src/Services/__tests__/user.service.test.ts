import { beforeEach, describe, expect, test, vi, type Mock } from "vitest";
import { PrismaClient } from "@prisma/client";
import { createUser, login, updateRefreshToken } from "../UserService";
import { Role } from "../../Models/user";

// Mocks
vi.mock("@prisma/client", () => ({
	PrismaClient: vi.fn(() => ({
		user: {
			create: vi.fn(),
			findUniqueOrThrow: vi.fn(),
			update: vi.fn(),
			findUnique: vi.fn(),
		},
	})),
}));

vi.mock("bcrypt", () => ({
	default: {
		hash: vi.fn().mockResolvedValue("hashed_password"),
		compare: vi.fn().mockResolvedValue(true),
	},
}));

vi.mock("valibot", () => ({
	parse: vi.fn().mockImplementation((_schema, input) => input),
}));

const mockPrisma = new PrismaClient();

describe("UserService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("createUser should return a new user id", async () => {
		const mockUser = { id: 1, email: "test@example.com" };
		(mockPrisma.user.create as Mock).mockResolvedValue(mockUser);

		const result = await createUser({
			email: "test@example.com",
			password: "password",
			role: Role.USER,
		});

		expect(mockPrisma.user.create).toHaveBeenCalledWith({
			data: {
				email: "test@example.com",
				password: "hashed_password",
				role: Role.USER,
			},
		});
		expect(result).toBe(mockUser.id);
	});

	test("createUser should throw error for duplicate email", async () => {
		const prismaError = new Error("Prisma error");
		prismaError.name = "PrismaClientKnownRequestError";
		(prismaError as any).code = "P2002";

		(mockPrisma.user.create as Mock).mockRejectedValue(prismaError);

		await expect(
			createUser({
				email: "duplicate@example.com",
				password: "password",
				role: Role.USER,
			}),
		).rejects.toThrow("Email already exists");
	});

	// Tests adicionales para otras funciones
	test("login should return public user", async () => {
		const mockUser = {
			id: 1,
			email: "test@example.com",
			password: "hashed_password",
			role: Role.USER,
		};

		(mockPrisma.user.findUniqueOrThrow as Mock).mockResolvedValue(mockUser);

		const result = await login({
			email: "test@example.com",
			password: "password",
		});

		expect(result).toEqual({
			id: 1,
			email: "test@example.com",
			role: Role.USER,
		});
	});

	test("updateRefreshToken should update user", async () => {
		(mockPrisma.user.update as Mock).mockResolvedValue({});

		await updateRefreshToken(1, "new_token");

		expect(mockPrisma.user.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { refreshToken: "new_token" },
		});
	});
});
