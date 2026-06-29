import { z } from "zod";

const cnpjRegex = /^\d{14}$/;
const employeeNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

export const registerSchema = (t) =>
  z
    .object({
      companyName: z
        .string({
          required_error: t("validation:company.name.required"),
        })
        .trim()
        .min(2, t("validation:company.name.min"))
        .max(45, t("validation:company.name.max")),

      companyEmail: z
        .string({
          required_error: t("validation:company.email.required"),
        })
        .trim()
        .email(t("validation:company.email.invalid"))
        .max(45, t("validation:company.email.max")),

      cnpj: z
        .string({
          required_error: t("validation:company.cnpj.required"),
        })
        .regex(cnpjRegex, t("validation:company.cnpj.invalid")),

      employeeName: z
        .string({
          required_error: t("validation:company.employee_name.required"),
        })
        .trim()
        .min(3, t("validation:company.employee_name.min"))
        .max(45, t("validation:company.employee_name.max"))
        .regex(employeeNameRegex, t("validation:company.employee_name.invalid")),

      password: z
        .string({
          required_error: t("validation:company.password.required"),
        })
        .min(8, t("validation:company.password.min"))
        .max(72, t("validation:company.password.max")),

      confirmPassword: z.string({
        required_error: t("validation:company.confirm_password.required"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("validation:company.confirm_password.not_match"),
    });

export const loginSchema = (t) =>
  z.object({
    companyEmail: z
      .string({
        required_error: t("validation:company.email.required"),
      })
      .trim()
      .email(t("validation:company.email.invalid"))
      .max(45, t("validation:company.email.max")),

    employeeName: z
      .string({
        required_error: t("validation:company.employee_name.required"),
      })
      .trim()
      .min(3, t("validation:company.employee_name.min"))
      .max(45, t("validation:company.employee_name.max"))
      .regex(employeeNameRegex, t("validation:company.employee_name.invalid")),

    password: z
      .string({
        required_error: t("validation:company.password.required"),
      })
      .min(8, t("validation:company.password.min"))
      .max(72, t("validation:company.password.max")),
  });