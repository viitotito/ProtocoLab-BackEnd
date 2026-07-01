import bcrypt from "bcrypt";
import prisma from "../configs/prisma.js";

import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

import { setRefreshCookie, clearRefreshCookie } from "../utils/cookies.js";

import { AppError } from "../utils/appError.js";

/**
 * Registra uma nova empresa, cria departamento padrão e usuário administrador.
 *
 * @async
 * @function register
 * @param {Object} data
 * @param {string} data.companyName - Nome da empresa.
 * @param {string} data.companyEmail - Email da empresa.
 * @param {string} data.cnpj - CNPJ da empresa.
 * @param {string} data.employeeName - Nome do usuário administrador.
 * @param {string} data.password - Senha do usuário.
 *
 * @returns {Promise<Object>} Dados do usuário criado e empresa vinculada.
 *
 * @throws {AppError} Se empresa já existir.
 */
export async function register(data) {
  const { companyName, companyEmail, cnpj, employeeName, password } = data;

  const companyExists = await prisma.company.findFirst({
    where: {
      OR: [{ email: companyEmail }, { cnpj }],
    },
  });

  if (companyExists) {
    throw new AppError("auth:error.company_already_exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: companyName,
        email: companyEmail,
        cnpj,
      },
    });

    const department = await tx.department.create({
      data: {
        name: "RH",
        description: "Default Department.",
        companyId: company.id,
      },
    });

    const user = await tx.user.create({
      data: {
        name: employeeName,
        email: companyEmail,
        password: hashedPassword,
        role: "ADMIN",
        companyId: company.id,
        departmentId: department.id,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: {
        id: company.id,
        name: company.name,
      },
    };
  });

  return result;
}

/**
 * Realiza login do usuário e gera tokens JWT.
 *
 * @async
 * @function login
 * @param {Object} data
 * @param {string} data.companyEmail - Email da empresa.
 * @param {string} data.employeeName - Nome do usuário.
 * @param {string} data.password - Senha do usuário.
 * @param {import("express").Response} res - Response do Express (para cookie refresh token).
 *
 * @returns {Promise<Object>} Tokens e dados básicos do usuário.
 *
 * @throws {AppError} Se credenciais forem inválidas.
 */
export async function login(data, res) {
  const { companyEmail, employeeName, password } = data;

  const company = await prisma.company.findUnique({
    where: { email: companyEmail },
  });

  if (!company) {
    throw new AppError("auth:error.invalid_credentials", 401);
  }

  const user = await prisma.user.findFirst({
    where: {
      companyId: company.id,
      name: employeeName,
    },
  });

  if (!user) {
    throw new AppError("auth:error.invalid_credentials", 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError("auth:error.invalid_credentials", 401);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  setRefreshCookie(res, refreshToken);

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    },
  };
}

/**
 * Gera um novo access token a partir de um refresh token válido.
 *
 * @async
 * @function refresh
 * @param {string} token - Refresh token JWT.
 *
 * @returns {Promise<string>} Novo access token.
 *
 * @throws {AppError} Se token estiver ausente ou usuário não existir.
 */
export async function refresh(token) {
  if (!token) {
    throw new AppError("auth:error.refresh_token_missing", 401);
  }

  const payload = verifyRefreshToken(token);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user) {
    throw new AppError("auth:error.user_not_found", 404);
  }

  return generateAccessToken(user);
}

/**
 * Retorna dados do usuário autenticado.
 *
 * @async
 * @function me
 * @param {string} userId - ID do usuário autenticado.
 *
 * @returns {Promise<Object>} Dados públicos do usuário.
 *
 * @throws {AppError} Se usuário não for encontrado.
 */
export async function me(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      companyId: true,
      departmentId: true,
    },
  });

  if (!user) {
    throw new AppError("auth:error.user_not_found", 404);
  }

  return user;
}

/**
 * Realiza logout removendo o refresh token armazenado em cookie.
 *
 * @async
 * @function logout
 * @param {import("express").Response} res - Response do Express.
 *
 * @returns {Object} Mensagem de sucesso.
 */
export async function logout(res) {
  clearRefreshCookie(res);
}