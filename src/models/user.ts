import {
	enum as valibotEnum,
	pipe,
	email,
	minLength,
	string,
	object,
	type InferInput,
	optional,
	nonEmpty,
} from "valibot";

export enum Role {
	ADMIN = "ADMIN",
	USER = "USER",
}

const emailSchema = pipe(
	string(),
	nonEmpty("Email is required"),
	email("Invalid email"),
);
const passwordSchema = pipe(
	string(),
	nonEmpty(),
	minLength(8, "Password must be at least 8 characters"),
);
const roleSchema = valibotEnum(Role);

export const authSchema = object({
	email: emailSchema,
	password: passwordSchema,
	refreshToken: optional(string()),
	role: optional(roleSchema, Role.USER),
});

export type User = InferInput<typeof authSchema> & {
	id: number;
};

export type publicUser = Omit<User, "password">;
