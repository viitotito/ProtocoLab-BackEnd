import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({
      required_error: "Nome é obrigatório.",
    })
    .min(3, "Nome deve ter pelo menos 3 caracteres.")
    .max(45, "Nome deve ter no máximo 45 caracteres."),

  email: z
    .string({
      required_error: "Email é obrigatório.",
    })
    .email("Email inválido.")
    .max(45, "Email deve ter no máximo 45 caracteres."),

  password: z
    .string({
      required_error: "Senha é obrigatória.",
    })
    .min(8, "Senha deve ter pelo menos 8 caracteres.")
    .max(72, "Senha deve ter no máximo 72 caracteres."),

  role: z
    .string({
      required_error: "Role é obrigatória.",
    })
    .min(3)
    .max(20),

  departmentId: z
    .number({
      required_error: "DepartmentId é obrigatório.",
    })
    .int("DepartmentId deve ser um número inteiro."),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).max(45).optional(),

  email: z.string().email().max(45).optional(),

  password: z.string().min(8).max(72).optional(),

  role: z.string().min(3).max(20).optional(),

  departmentId: z.number().int().optional(),
});