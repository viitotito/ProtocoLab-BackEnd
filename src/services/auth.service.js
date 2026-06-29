import bcrypt from "bcrypt";
import prisma from "../configs/prisma.js";

import { generateAccessToken, generateRefreshToken, verifyRefreshToken} from "../utils/jwt.js";

import { setRefreshCookie, clearRefreshCookie } from "../utils/cookies.js";

import { AppError } from "../utils/appError.js";

export async function register(data) {
  const { companyName, companyEmail, cnpj, employeeName, password } = data;

  const companyExists = await prisma.company.findFirst({
    where: {
      OR: [{ email: companyEmail }, { cnpj }],
    },
  });

  if (companyExists) {
    throw new AppError("auth:company_already_exists");
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
        role: "Admin",
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

export async function login(data, res) {
  const { companyEmail, employeeName, password } = data;

  const company = await prisma.company.findUnique({
    where: { email: companyEmail },
  });

  if (!company) {
    throw new AppError("auth:invalid_credentials", 401);
  }

  const user = await prisma.user.findFirst({
    where: {
      companyId: company.id,
      name: employeeName,
    },
  });

  if (!user) {
    throw new AppError("auth:invalid_credentials", 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError("auth:invalid_credentials", 401);
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

export async function refresh(token) {
  if (!token) {
    throw new AppError("auth:refresh_token_missing", 401);
  }

  const payload = verifyRefreshToken(token);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user) {
    throw new AppError("auth:user_not_found", 404);
  }

  return generateAccessToken(user);
}

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
    throw new AppError("auth:user_not_found", 404);
  }

  return user;
}

export async function logout(res) {
  clearRefreshCookie(res);

  return {
    message: "auth:logout_success",
  };
}