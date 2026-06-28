import bcrypt from "bcrypt";
import prisma from "../configs/prisma.js";

import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

import { setRefreshCookie, clearRefreshCookie } from "../utils/cookies.js";

export async function register(data) {
  const {
    companyName,
    companyEmail,
    cnpj,
    employeeName,
    password,
  } = data;

  const companyEmailExists = await prisma.companies.findUnique({
    where: {
      email: companyEmail,
    },
  });

  if (companyEmailExists) {
    throw new Error("Já existe uma empresa com este e-mail.");
  }

  const companyCnpjExists = await prisma.companies.findUnique({
    where: {
      cnpj,
    },
  });

  if (companyCnpjExists) {
    throw new Error("Já existe uma empresa com este CNPJ.");
  }

  const userExists = await prisma.users.findUnique({
    where: {
      email: companyEmail,
    },
  });

  if (userExists) {
    throw new Error("Já existe um usuário com este e-mail.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.companies.create({
      data: {
        name: companyName,
        email: companyEmail,
        cnpj,
      },
    });

    const department = await tx.departments.create({
      data: {
        name: "Administração",
        description: "Departamento criado automaticamente pelo sistema.",
        companyId: company.id,
      },
    });

    const user = await tx.users.create({
      data: {
        name: employeeName,
        email: companyEmail,
        password: hashedPassword,
        role: "Gerente",
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

  const company = await prisma.companies.findUnique({
    where: {
      email: companyEmail,
    },
  });

  if (!company) {
    throw new Error("Empresa não encontrada.");
  }

  const user = await prisma.users.findFirst({
    where: {
      companyId: company.id,
      name: employeeName,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Senha inválida.");
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
    throw new Error("Refresh token não informado.");
  }

  const payload = verifyRefreshToken(token);

  const user = await prisma.users.findUnique({
    where: {
      id: payload.sub,
    },
  });

  if (!user) {
    throw new Error("Usuário inválido.");
  }

  return generateAccessToken(user);
}

export async function me(userId) {
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
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
    throw new Error("Usuário não encontrado.");
  }

  return user;
}

export async function logout(res) {
  clearRefreshCookie(res);

  return {
    message: "Logout realizado com sucesso.",
  };
}