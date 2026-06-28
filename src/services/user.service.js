import prisma from "../configs/prisma.js";
import bcrypt from "bcrypt";

export async function listUsers(companyId) {
  return prisma.user.findMany({
    where: { companyId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      departmentId: true,
    },
  });
}

export async function getUserById(id, companyId) {
  return prisma.user.findFirst({
    where: {
      id,
      companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      departmentId: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function createUser(companyId, data) {
  const { name, email, password, role, departmentId } = data;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new Error("Email já cadastrado.");
  }

  const department = await prisma.department.findFirst({
    where: {
      id: departmentId,
      companyId,
    },
  });

  if (!department) {
    throw new Error("Departamento inválido para esta empresa.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      companyId,
      departmentId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      departmentId: true,
    },
  });
}

export async function updateUser(id, companyId, data) {
  return prisma.user.updateMany({
    where: {
      id,
      companyId,
    },
    data,
  });
}

export async function deleteUser(id, companyId) {
  return prisma.user.deleteMany({
    where: {
      id,
      companyId,
    },
  });
}