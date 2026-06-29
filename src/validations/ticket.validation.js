import { z } from "zod";

export const createTicketSchema = (t) =>
  z.object({
    title: z
      .string({
        required_error: t("ticket:title.required"),
      })
      .trim()
      .min(3, t("ticket:title.min"))
      .max(25, t("ticket:title.max")),

    description: z
      .string({
        required_error: t("ticket:description.required"),
      })
      .trim()
      .min(5, t("ticket:description.min"))
      .max(80, t("ticket:description.max")),

    departmentId: z
      .number({
        required_error: t("ticket:department.required"),
      })
      .int(t("ticket:department.invalid")),

    priority: z.enum(["HIGH", "NORMAL", "LOW"], {
      required_error: t("ticket:priority.required"),
      errorMap: () => ({
        message: t("ticket:priority.invalid"),
      }),
    }),
  });

export const updateTicketSchema = (t) =>
  z
    .object({
      title: z
        .string()
        .trim()
        .min(3, t("ticket:title.min"))
        .max(25, t("ticket:title.max"))
        .optional(),

      description: z
        .string()
        .trim()
        .min(5, t("ticket:description.min"))
        .max(80, t("ticket:description.max"))
        .optional(),

      status: z
        .enum(["OPEN", "IN_PROGRESS", "CLOSED"], {
          errorMap: () => ({
            message: t("ticket:status.invalid"),
          }),
        })
        .optional(),

      priority: z
        .enum(["HIGH", "NORMAL", "LOW"], {
          errorMap: () => ({
            message: t("ticket:priority.invalid"),
          }),
        })
        .optional(),

      departmentId: z
        .number()
        .int(t("ticket:department.invalid"))
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: t("ticket:update.empty"),
    });