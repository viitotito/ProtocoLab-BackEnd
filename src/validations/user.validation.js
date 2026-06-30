import { z } from "zod";

const userNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

export const createUserSchema = (t) =>
  z.object({
    name: z
      .string({
        required_error: t("validation:user.name.required"),
      })
      .trim()
      .min(3, t("validation:user.name.min"))
      .max(45, t("validation:user.name.max"))
      .regex(userNameRegex, t("validation:user.name.invalid")),

    email: z
      .string({
        required_error: t("validation:user.email.required"),
      })
      .trim()
      .email(t("validation:user.email.invalid"))
      .max(45, t("validation:user.email.max")),

    password: z
      .string({
        required_error: t("validation:user.password.required"),
      })
      .trim()
      .min(8, t("validation:user.password.min"))
      .max(72, t("validation:user.password.max")),

    role: z
      .string({
        required_error: t("validation:user.role.required"),
      })
      .trim()
      .min(3, t("validation:user.role.min"))
      .max(20, t("validation:user.role.max")),

    departmentId: z
      .number({
        required_error: t("validation:user.department.required"),
      })
      .int(t("validation:user.department.invalid")),
  });

export const updateUserSchema = (t) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(3, t("validation:user.name.min"))
      .max(45, t("validation:user.name.max"))
      .regex(userNameRegex, t("validation:user.name.invalid"))
      .optional(),

    email: z
      .string()
      .trim()
      .email(t("validation:user.email.invalid"))
      .max(45, t("validation:user.email.max"))
      .optional(),

    password: z
      .string()
      .trim()
      .min(8, t("validation:user.password.min"))
      .max(72, t("validation:user.password.max"))
      .optional(),

    role: z
      .string()
      .trim()
      .min(3, t("validation:user.role.min"))
      .max(20, t("validation:user.role.max"))
      .optional(),

    departmentId: z
      .number()
      .int(t("validation:user.department.invalid"))
      .optional(),
  });