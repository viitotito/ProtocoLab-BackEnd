import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({
      required_error: "O nome do usuário é obrigatório.",
    })
    .trim()
    .min(3, "O nome deve ter no mínimo 3 caracteres.")
    .max(45, "O nome deve ter no máximo 45 caracteres."),

  email: z
    .string({
      required_error: "O e-mail do usuário é obrigatório.",
    })
    .trim()
    .email("Informe um e-mail válido.")
    .max(45, "O e-mail deve ter no máximo 45 caracteres."),

  password: z
    .string({
      required_error: "A senha é obrigatória.",
    })
    .trim()
    .min(8, "A senha deve ter no mínimo 8 caracteres.")
    .max(72, "A senha deve ter no máximo 72 caracteres."),

  role: z
    .string({
      required_error: "O papel (role) do usuário é obrigatório.",
    })
    .trim()
    .min(3, "O papel deve ter no mínimo 3 caracteres.")
    .max(20, "O papel deve ter no máximo 20 caracteres."),

  departmentId: z
    .number({
      required_error: "O departamento é obrigatório.",
    })
    .int("O ID do departamento deve ser um número inteiro."),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome deve ter no mínimo 3 caracteres.")
    .max(45, "O nome deve ter no máximo 45 caracteres.")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .max(45, "O e-mail deve ter no máximo 45 caracteres.")
    .optional(),

  password: z
    .string()
    .trim()
    .min(8, "A senha deve ter no mínimo 8 caracteres.")
    .max(72, "A senha deve ter no máximo 72 caracteres.")
    .optional(),

  role: z
    .string()
    .trim()
    .min(3, "O papel deve ter no mínimo 3 caracteres.")
    .max(20, "O papel deve ter no máximo 20 caracteres.")
    .optional(),

  departmentId: z
    .number()
    .int("O ID do departamento deve ser um número inteiro.")
    .optional(),
});