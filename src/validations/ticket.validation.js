import { z } from "zod";

export const createTicketSchema = z.object({
  title: z
    .string({
      required_error: "O título do chamado é obrigatório.",
    })
    .trim()
    .min(3, "O título deve ter no mínimo 3 caracteres.")
    .max(25, "O título deve ter no máximo 25 caracteres."),

  description: z
    .string({
      required_error: "A descrição do chamado é obrigatória.",
    })
    .trim()
    .min(5, "A descrição deve ter no mínimo 5 caracteres.")
    .max(80, "A descrição deve ter no máximo 80 caracteres."),

  departmentId: z
    .number({
      required_error: "O departamento é obrigatório.",
    })
    .int("O ID do departamento deve ser um número inteiro."),

  priority: z.enum(["HIGH", "NORMAL", "LOW"], {
    required_error: "A prioridade é obrigatória.",
    errorMap: () => ({
      message: "Prioridade inválida.",
    }),
  }),
});

export const updateTicketSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "O título deve ter no mínimo 3 caracteres.")
      .max(25, "O título deve ter no máximo 25 caracteres.")
      .optional(),

    description: z
      .string()
      .trim()
      .min(5, "A descrição deve ter no mínimo 5 caracteres.")
      .max(80, "A descrição deve ter no máximo 80 caracteres.")
      .optional(),

    status: z
      .enum(["OPEN", "IN_PROGRESS", "CLOSED"], {
        errorMap: () => ({
          message: "Status inválido.",
        }),
      })
      .optional(),

    priority: z
      .enum(["HIGH", "NORMAL", "LOW"], {
        errorMap: () => ({
          message: "Prioridade inválida.",
        }),
      })
      .optional(),

    departmentId: z
      .number()
      .int("O ID do departamento deve ser um número inteiro.")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe pelo menos um campo para atualização.",
  });