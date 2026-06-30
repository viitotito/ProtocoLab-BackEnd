import { z } from "zod";

export const createTicketSchema = (t) =>
  z.object({
    title: z.string({
      required_error: t("validation:ticket.title.required"),
    })
    .trim()
    .min(3, t("validation:ticket.title.min"))
    .max(25, t("validation:ticket.title.max")),

    description: z.string({
      required_error: t("validation:ticket.description.required"),
    })
    .trim()
    .min(5, t("validation:ticket.description.min"))
    .max(80, t("validation:ticket.description.max")),

    departmentId: z.number({
      required_error: t("validation:ticket.department.required"),
    }).int(t("validation:ticket.department.invalid")),

    priority: z.string({
      required_error: t("validation:ticket.priority.required"),
    }),
  });

export const updateTicketSchema = (t) =>
  z.object({
    title: z.string()
      .trim()
      .min(3, t("validation:ticket.title.min"))
      .max(25, t("validation:ticket.title.max"))
      .optional(),

    description: z.string()
      .trim()
      .min(5, t("validation:ticket.description.min"))
      .max(80, t("validation:ticket.description.max"))
      .optional(),

    status: z.string().optional(),

    priority: z.string().optional(),

    departmentId: z.number()
      .int(t("validation:ticket.department.invalid"))
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: t("validation:ticket.update.empty"),
  });