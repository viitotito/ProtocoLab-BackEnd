import prisma from "../configs/prisma.js";

export async function createDepartment(companyId, data) {
  const { name, description } = data;

  const exists = await prisma.department.findFirst({
    where: {
      name,
      companyId,
    },
  });

  if (exists) {
    throw new Error("Já existe um departamento com esse nome nesta empresa.");
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

export async function getDepartmentById(id, companyId) {
  return prisma.department.findFirst({
    where: {
      id,
      companyId,
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      tickets: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
  });
}

export async function updateDepartment(id, companyId, data) {
  const result = await prisma.department.updateMany({
    where: {
      id,
      companyId,
    },
    data,
  });

  if (result.count === 0) {
    throw new Error("Departamento não encontrado.");
  }

  return prisma.department.findFirst({
    where: {
      id,
      companyId,
    },
  });
}

export async function deleteDepartment(id, companyId) {
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
    throw new Error("Departamento não encontrado.");
  }

  if (department.users.length > 0) {
    throw new Error("Não é possível deletar departamento com usuários vinculados.");
  }

  if (department.tickets.length > 0) {
    throw new Error("Não é possível deletar departamento com tickets vinculados.");
  }

  await prisma.department.delete({
    where: {
      id,
    },
  });

  return { message: "Departamento deletado com sucesso." };
}