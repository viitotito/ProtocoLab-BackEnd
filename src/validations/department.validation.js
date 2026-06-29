import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string({
      required_error: "O nome do departamento é obrigatório.",
    })
    .trim()
    .min(2, "O nome deve ter no mínimo 2 caracteres.")
    .max(25, "O nome deve ter no máximo 25 caracteres."),

  description: z
    .string({
      required_error: "A descrição é obrigatória.",
    })
    .trim()
    .min(5, "A descrição deve ter no mínimo 5 caracteres.")
    .max(80, "A descrição deve ter no máximo 80 caracteres."),
});

export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter no mínimo 2 caracteres.")
    .max(25, "O nome deve ter no máximo 25 caracteres.")
    .optional(),

  description: z
    .string()
    .trim()
    .min(5, "A descrição deve ter no mínimo 5 caracteres.")
    .max(80, "A descrição deve ter no máximo 80 caracteres.")
    .optional(),
});