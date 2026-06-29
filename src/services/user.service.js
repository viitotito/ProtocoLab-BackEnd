import prisma from "../configs/prisma.js";
import bcrypt from "bcrypt";

export async function createUser(companyId, data) {
  const { name, email, password, role, departmentId } = data;

  const userExists = await prisma.user.findFirst({
    where: {
      email,
      companyId,
    },
  });

  if (userExists) {
    throw new Error("Email já cadastrado nesta empresa.");
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

export async function updateUser(id, companyId, loggedUserId, data) {
  if (id === loggedUserId) {
    throw new Error("Você não pode alterar seu próprio usuário.");
  }

  const updateData = { ...data };

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  if (updateData.email) {
  const emailExists = await prisma.user.findFirst({
    where: {
      email: updateData.email,
      companyId,
      NOT: {
        id,
      },
    },
  });

  if (emailExists) {
    throw new Error("Este e-mail já está em uso nesta empresa.");
  }
}
  const result = await prisma.user.updateMany({
    where: {
      id,
      companyId,
    },
    data: updateData,
  });

  if (result.count === 0) {
    throw new Error("Usuário não encontrado.");
  }


  return prisma.user.findFirst({
    where: { id, companyId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      departmentId: true,
    },
  });
}

export async function deleteUser(id, companyId, loggedUserId) {
  if (id === loggedUserId) {
    throw new Error("Você não pode deletar seu próprio usuário.");
  }

  const deleted = await prisma.user.deleteMany({
    where: {
      id,
      companyId,
    },
  });

  if (deleted.count === 0) {
    throw new Error("Usuário não encontrado.");
  }

  return { message: "Usuário deletado com sucesso." };
}