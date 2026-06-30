import prisma from "../configs/prisma.js";
import bcrypt from "bcrypt";
import { AppError } from "../utils/appError.js";

/**
 * Cria um novo usuário dentro de uma empresa.
 *
 * @async
 * @function createUser
 * @param {string} companyId - ID da empresa.
 * @param {Object} data - Dados do usuário.
 * @param {string} data.name - Nome do usuário.
 * @param {string} data.email - Email do usuário.
 * @param {string} data.password - Senha do usuário.
 * @param {string} data.role - Papel do usuário (ex: Admin, User).
 * @param {string} data.departmentId - ID do departamento.
 *
 * @returns {Promise<Object>} Usuário criado (sem senha).
 *
 * @throws {AppError} Se email já existir na empresa.
 * @throws {AppError} Se departamento for inválido.
 */
export async function createUser(companyId, data) {
  const { name, email, password, role, departmentId } = data;

  const userExists = await prisma.user.findFirst({
    where: { email, companyId },
  });

  if (userExists) {
    throw new AppError("user:error.email_exists");
  }

  const department = await prisma.department.findFirst({
    where: { id: departmentId, companyId },
  });

  if (!department) {
    throw new AppError("user:error.department_invalid");
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

/**
 * Lista todos os usuários de uma empresa.
 *
 * @async
 * @function listUsers
 * @param {string} companyId - ID da empresa.
 *
 * @returns {Promise<Array<Object>>} Lista de usuários.
 */
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

/**
 * Busca um usuário pelo ID dentro de uma empresa.
 *
 * @async
 * @function getUserById
 * @param {string} id - ID do usuário.
 * @param {string} companyId - ID da empresa.
 *
 * @returns {Promise<Object>} Usuário encontrado com departamento.
 *
 * @throws {AppError} Se usuário não existir.
 */
export async function getUserById(id, companyId) {
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
    throw new AppError("user:error.user_not_found");
  }

  return user;
}

/**
 * Atualiza um usuário existente.
 *
 * Regras:
 * - Não pode atualizar a si mesmo.
 * - Email deve ser único dentro da empresa.
 * - Senha é re-hash automaticamente se enviada.
 *
 * @async
 * @function updateUser
 * @param {string} id - ID do usuário a ser atualizado.
 * @param {string} companyId - ID da empresa.
 * @param {string} loggedUserId - ID do usuário autenticado.
 * @param {Object} data - Dados de atualização.
 * @param {string} [data.name]
 * @param {string} [data.email]
 * @param {string} [data.password]
 * @param {string} [data.role]
 * @param {string} [data.departmentId]
 *
 * @returns {Promise<Object>} Usuário atualizado.
 *
 * @throws {AppError} Se tentar atualizar a si mesmo.
 * @throws {AppError} Se email já existir.
 * @throws {AppError} Se usuário não existir.
 */
export async function updateUser(id, companyId, loggedUserId, data) {
  if (id === loggedUserId) {
    throw new AppError("user:error.self_update");
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
      throw new AppError("user:error.email_exists");
    }
  }

  const result = await prisma.user.updateMany({
    where: { id, companyId },
    data: updateData,
  });

  if (result.count === 0) {
    throw new AppError("user:error.user_not_found",404);
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

/**
 * Remove um usuário de uma empresa.
 *
 * Regras:
 * - Não pode remover a si mesmo.
 * - Pode falhar por dependências no banco (tickets, relações, etc).
 *
 * @async
 * @function deleteUser
 * @param {string} id - ID do usuário.
 * @param {string} companyId - ID da empresa.
 * @param {string} loggedUserId - ID do usuário autenticado.
 *
 * @returns {Promise<Object>} Mensagem de sucesso.
 *
 * @throws {AppError} Se tentar deletar a si mesmo.
 * @throws {AppError} Se usuário não existir.
 * @throws {AppError} Se houver dependências (P2003).
 */
export async function deleteUser(id, companyId, loggedUserId) {
  if (id === loggedUserId) {
    throw new AppError("user:error.self_delete");
  }

  try {
    const deleted = await prisma.user.deleteMany({
      where: {
        id,
        companyId,
      },
    });

    if (deleted.count === 0) {
      throw new AppError("user:error.user_not_found",404);
    }

    return {
      message: "user:success.user_deleted",
    };
  } catch (err) {
    if (err.code === "P2003") {
      throw new AppError("user:error.has_dependencies");
    }

    throw err;
  }
}