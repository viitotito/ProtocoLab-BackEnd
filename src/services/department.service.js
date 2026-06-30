import prisma from "../configs/prisma.js";

export async function createDepartment(companyId, data, t) {
  const { name, description } = data;

  const exists = await prisma.department.findFirst({
    where: {
      name,
      companyId,
    },
  });

  if (exists) {
    throw new Error(t("department:error.name_exists"));
  }

  return prisma.department.create({
    data: {
      name,
      description,
      companyId,
    },
  });
}

export async function listDepartments(companyId) {
  return prisma.department.findMany({
    where: { companyId },
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          users: true,
          tickets: true,
        },
      },
    },
  });
}

export async function listUsersByDepartment(departmentId, companyId, t) {
  const department = await prisma.department.findFirst({
    where: {
      id: departmentId,
      companyId,
    },
  });

  if (!department) {
    throw new Error(t("department:error.department_not_found"));
  }

  return prisma.user.findMany({
    where: {
      departmentId,
      companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}

export async function getDepartmentById(id, companyId, t) {
  const department = await prisma.department.findFirst({
    where: {
      id,
      companyId,
    },
    include: {
      users: true,
      tickets: true,
    },
  });

  if (!department) {
    throw new Error(t("department:error.department_not_found"));
  }

  return department;
}

export async function updateDepartment(id, companyId, data, t) {
  const result = await prisma.department.updateMany({
    where: {
      id,
      companyId,
    },
    data,
  });

  if (result.count === 0) {
    throw new Error(t("department:error.department_not_found"));
  }

  return prisma.department.findFirst({
    where: {
      id,
      companyId,
    },
  });
}

export async function deleteDepartment(id, companyId, t) {
  const department = await prisma.department.findFirst({
    where: {
      id,
      companyId,
    },
    include: {
      users: true,
      tickets: true,
    },
  });

  if (!department) {
    throw new Error(t("department:error.department_not_found"));
  }

  if (department.users.length > 0) {
    throw new Error(t("department:error.has_users"));
  }

  if (department.tickets.length > 0) {
    throw new Error(t("department:error.has_tickets"));
  }

  await prisma.department.delete({
    where: { id },
  });

  return { message: t("department:success.department_deleted") };
}