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
    confirmPassword,
  } = data;

  if (password !== confirmPassword) {
    throw new Error("Senhas não conferem.");
  }

  let company = await prisma.company.findUnique({
    where: { email: companyEmail },
  });

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: companyName,
        email: companyEmail,
        cnpj,
      },
    });
  }

  const usersCount = await prisma.user.count({
    where: { companyId: company.id },
  });

  const userExists = await prisma.user.findFirst({
    where: {
      name: employeeName,
      companyId: company.id,
    },
  });

  if (userExists) {
    throw new Error("Usuário já existe nessa empresa.");
  }

  const role = usersCount === 0 ? "Gerente" : "Auxiliar";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: employeeName,
      password: hashedPassword,
      role,
      companyId: company.id,
      departmentId: 1, 
    },
  });

  return user;
}

export async function login(data, res) {
  const { companyEmail, employeeName, password } = data;

  const company = await prisma.company.findUnique({
    where: { email: companyEmail },
  });

  if (!company) {
    throw new Error("Empresa não encontrada.");
  }

  const user = await prisma.user.findFirst({
    where: {
      name: employeeName,
      companyId: company.id,
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
    user,
    accessToken,
  };
}

export async function refresh(token) {
  const payload = verifyRefreshToken(token);

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  if (!user) {
    throw new Error("Usuário inválido.");
  }

  return generateAccessToken(user);
}

export async function me(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      role: true,
      companyId: true,
    },
  });
}

export async function logout(res) {
  clearRefreshCookie(res);

  return { message: "Logout realizado com sucesso." };
}