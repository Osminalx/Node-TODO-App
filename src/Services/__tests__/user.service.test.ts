import { beforeEach, describe, expect, test, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { createUser } from "../UserService";

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
  parse: vi.fn().mockImplementation((schema, input) => input),
}));

const mockPrisma = new PrismaClient();

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("createUser should return a new user id", async () => {
    // Configurar mocks
    const mockUser = { id: 1, email: "test@example.com" };
    (mockPrisma.user.create as vi.Mock).mockResolvedValue(mockUser);

    // Ejecutar
    const result = await createUser({
      email: "test@example.com",
      password: "password",
      role: "USER",
    });

    // Verificar
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        password: "hashed_password",
        role: "USER",
      },
    });
    expect(result).toBe(mockUser.id);
  });

  test("createUser should throw error for duplicate email", async () => {
    // Mockear error de Prisma
    const prismaError = new Error("Prisma error");
    prismaError.name = "PrismaClientKnownRequestError";
    (prismaError as any).code = "P2002";

    (mockPrisma.user.create as vi.Mock).mockRejectedValue(prismaError);

    // Ejecutar y verificar
    await expect(
      createUser({
        email: "duplicate@example.com",
        password: "password",
        role: "USER",
      }),
    ).rejects.toThrow("Email already exists");
  });
});
