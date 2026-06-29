import { z } from "zod";

const cnpjRegex = /^\d{14}$/;
const employeeNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

export const registerSchema = (t) =>
    z
        .object({
            companyName: z
                .string({
                    required_error: t("validation:company_name_required"),
                })
                .trim()
                .min(2, t("validation:company_name_min"))
                .max(45, t("validation:company_name_max")),

            companyEmail: z
                .string({
                    required_error: t("validation:email_required"),
                })
                .trim()
                .email(t("validation:email_invalid"))
                .max(45, t("validation:email_max")),

            cnpj: z
                .string({
                    required_error: t("validation:cnpj_required"),
                })
                .regex(cnpjRegex, t("validation:cnpj_invalid")),

            employeeName: z
                .string({
                    required_error: t("validation:employee_name_required"),
                })
                .trim()
                .min(3, t("validation:employee_name_min"))
                .max(45, t("validation:employee_name_max"))
                .regex(employeeNameRegex, t("validation:employee_name_invalid")),

            password: z
                .string({
                    required_error: t("validation:password_required"),
                })
                .min(8, t("validation:password_min"))
                .max(72, t("validation:password_max")),

            confirmPassword: z.string({
                required_error: t("validation:confirm_password_required"),
            }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            path: ["confirmPassword"],
            message: t("validation:passwords_not_match"),
        });

export const loginSchema = (t) =>
    z.object({
        companyEmail: z
            .string({
                required_error: t("validation:email_required"),
            })
            .trim()
            .email(t("validation:email_invalid"))
            .max(45, t("validation:email_max")),

        employeeName: z
            .string({
                required_error: t("validation:employee_name_required"),
            })
            .trim()
            .min(3, t("validation:employee_name_min"))
            .max(45, t("validation:employee_name_max"))
            .regex(employeeNameRegex, t("validation:employee_name_invalid")),

        password: z
            .string({
                required_error: t("validation:password_required"),
            })
            .min(8, t("validation:password_min"))
            .max(72, t("validation:password_max")),
    });