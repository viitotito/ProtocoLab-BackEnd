import prisma from "../configs/prisma.js";

/**
 * Cria um novo departamento dentro de uma empresa.
 *
 * @async
 * @function createDepartment
 * @param {string} companyId - ID da empresa.
 * @param {Object} data - Dados do departamento.
 * @param {string} data.name - Nome do departamento.
 * @param {string} data.description - Descrição do departamento.
 * @param {Function} t - Função de tradução i18n.
 *
 * @returns {Promise<Object>} Departamento criado.
 *
 * @throws {Error} Se já existir um departamento com o mesmo nome na empresa.
 */
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

/**
 * Lista todos os departamentos de uma empresa.
 *
 * @async
 * @function listDepartments
 * @param {string} companyId - ID da empresa.
 *
 * @returns {Promise<Array<Object>>} Lista de departamentos com contagem de usuários e tickets.
 */
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

/**
 * Lista usuários de um departamento específico dentro de uma empresa.
 *
 * @async
 * @function listUsersByDepartment
 * @param {string} departmentId - ID do departamento.
 * @param {string} companyId - ID da empresa.
 * @param {Function} t - Função de tradução i18n.
 *
 * @returns {Promise<Array<Object>>} Lista de usuários do departamento.
 *
 * @throws {Error} Se o departamento não existir.
 */
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

/**
 * Busca um departamento pelo ID incluindo usuários e tickets.
 *
 * @async
 * @function getDepartmentById
 * @param {string} id - ID do departamento.
 * @param {string} companyId - ID da empresa.
 * @param {Function} t - Função de tradução i18n.
 *
 * @returns {Promise<Object>} Departamento com relações (users e tickets).
 *
 * @throws {Error} Se o departamento não existir.
 */
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

/**
 * Atualiza um departamento existente.
 *
 * @async
 * @function updateDepartment
 * @param {string} id - ID do departamento.
 * @param {string} companyId - ID da empresa.
 * @param {Object} data - Dados atualizados do departamento.
 * @param {Function} t - Função de tradução i18n.
 *
 * @returns {Promise<Object>} Departamento atualizado.
 *
 * @throws {Error} Se o departamento não for encontrado.
 */
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

/**
 * Remove um departamento, desde que não tenha usuários ou tickets vinculados.
 *
 * @async
 * @function deleteDepartment
 * @param {string} id - ID do departamento.
 * @param {string} companyId - ID da empresa.
 * @param {Function} t - Função de tradução i18n.
 *
 * @returns {Promise<Object>} Mensagem de sucesso.
 *
 * @throws {Error} Se departamento não existir.
 * @throws {Error} Se houver usuários vinculados.
 * @throws {Error} Se houver tickets vinculados.
 */
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