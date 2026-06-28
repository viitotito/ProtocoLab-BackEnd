import { z } from "zod";

const cnpjRegex = /^\d{14}$/;

export const registerSchema = z
    .object({
        companyName: z
            .string({
                required_error: "Nome da empresa é obrigatório.",
            })
            .trim()
            .min(2, "Nome da empresa deve possuir pelo menos 2 caracteres.")
            .max(45, "Nome da empresa deve possuir no máximo 45 caracteres."),

        companyEmail: z
            .string({
                required_error: "Email da empresa é obrigatório.",
            })
            .trim()
            .email("Email da empresa inválido.")
            .max(45, "Email da empresa deve possuir no máximo 45 caracteres."),

        cnpj: z
            .string({
                required_error: "CNPJ é obrigatório.",
            })
            .regex(cnpjRegex, "CNPJ deve conter exatamente 14 números."),

        employeeName: z
            .string({
                required_error: "Nome do funcionário é obrigatório.",
            })
            .trim()
            .min(3, "Nome deve possuir pelo menos 3 caracteres.")
            .max(45, "Nome deve possuir no máximo 45 caracteres."),

        password: z
            .string({
                required_error: "Senha é obrigatória.",
            })
            .min(8, "Senha deve possuir pelo menos 8 caracteres.")
            .max(72, "Senha deve possuir no máximo 72 caracteres."),

        confirmPassword: z.string({
            required_error: "Confirmação de senha é obrigatória.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "As senhas não coincidem.",
    });

export const loginSchema = z.object({
    companyEmail: z
        .string({
            required_error: "Email da empresa é obrigatório.",
        })
        .trim()
        .email("Email inválido.")
        .max(45, "Email deve possuir no máximo 45 caracteres."),

    employeeName: z
        .string({
            required_error: "Nome do funcionário é obrigatório.",
        })
        .trim()
        .min(3, "Nome deve possuir pelo menos 3 caracteres.")
        .max(45, "Nome deve possuir no máximo 45 caracteres."),

    password: z
        .string({
            required_error: "Senha é obrigatória.",
        })
        .min(8, "Senha deve possuir pelo menos 8 caracteres.")
        .max(72, "Senha deve possuir no máximo 72 caracteres."),
});