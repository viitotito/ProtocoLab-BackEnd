import prisma from "../configs/prisma.js";
import bcrypt from "bcrypt";

export async function createUser(companyId, data, t) {
  const { name, email, password, role, departmentId } = data;

  const userExists = await prisma.user.findFirst({
    where: { email, companyId },
  });

  if (userExists) {
    throw new Error(t("user:error.email_exists"));
  }

  const department = await prisma.department.findFirst({
    where: { id: departmentId, companyId },
  });

  if (!department) {
    throw new Error(t("user:error.department_invalid"));
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

export async function getUserById(id, companyId, t) {
  const user = await prisma.user.findFirst({
    where: { id, companyId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      departmentId: true,
      department: {
        select: { id: true, name: true },
      },
    },
  });

  if (!user) {
    throw new Error(t("user:error.user_not_found"));
  }

  return user;
}

export async function updateUser(id, companyId, loggedUserId, data, t) {
  if (id === loggedUserId) {
    throw new Error(t("user:error.self_update"));
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
        NOT: { id },
      },
    });

    if (emailExists) {
      throw new Error(t("user:error.email_exists"));
    }
  }

  const result = await prisma.user.updateMany({
    where: { id, companyId },
    data: updateData,
  });

  if (result.count === 0) {
    throw new Error(t("user:error.user_not_found"));
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

export async function deleteUser(id, companyId, loggedUserId, t) {
  if (id === loggedUserId) {
    throw new Error(t("user:error.self_delete"));
  }

  const deleted = await prisma.user.deleteMany({
    where: { id, companyId },
  });

  if (deleted.count === 0) {
    throw new Error(t("user:error.user_not_found"));
  }

  return { message: t("user:success.user_deleted") };
}