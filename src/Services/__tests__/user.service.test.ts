import { beforeEach, describe, expect, test, vi } from "vitest";
import { UserService } from "../UserService";
import { prisma } from "../../prisma";

vi.mock("../../prisma", () => {
  prisma: {
    user: {
      findUnique: vi.fn();
      create: vi.fn();
    }
  }
});

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    vi.clearAllMocks();
  });
});
