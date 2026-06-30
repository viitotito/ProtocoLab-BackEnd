import { z } from "zod";

export const createDepartmentSchema = (t) =>
  z.object({
    name: z
      .string({
        required_error: t("validation:department.name.required"),
      })
      .trim()
      .min(2, t("validation:department.name.min"))
      .max(25, t("validation:department.name.max")),

    description: z
      .string({
        required_error: t("validation:department.description.required"),
      })
      .trim()
      .min(5, t("validation:department.description.min"))
      .max(80, t("validation:department.description.max")),
  });

export const updateDepartmentSchema = (t) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, t("validation:department.name.min"))
      .max(25, t("validation:department.name.max"))
      .optional(),

    description: z
      .string()
      .trim()
      .min(5, t("validation:department.description.min"))
      .max(80, t("validation:department.description.max"))
      .optional(),
  });