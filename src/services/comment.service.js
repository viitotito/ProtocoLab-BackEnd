import prisma from "../configs/prisma.js";
import { AppError } from "../utils/appError.js";

/**
 * Busca um ticket garantindo que ele pertence à empresa informada.
 *
 * @async
 * @function getTicket
 * @param {string} ticketId - ID do ticket.
 * @param {string} companyId - ID da empresa.
 *
 * @returns {Promise<Object>} Ticket encontrado.
 *
 * @throws {AppError} Se o ticket não existir ou não pertencer à empresa.
 */
async function getTicket(ticketId, companyId) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      department: {
        companyId,
      },
    },
  });

  if (!ticket) {
    throw new AppError("comment:error.ticket_not_found", 404);
  }

  return ticket;
}

/**
 * Cria um comentário em um ticket.
 *
 * @async
 * @function createComment
 * @param {string} ticketId - ID do ticket.
 * @param {string} userId - ID do usuário que cria o comentário.
 * @param {string} companyId - ID da empresa.
 * @param {Object} data - Dados do comentário.
 * @param {string} data.description - Conteúdo do comentário.
 *
 * @returns {Promise<Object>} Comentário criado com dados do usuário.
 *
 * @throws {AppError} Se o ticket não existir.
 */
export async function createComment(ticketId, userId, companyId, data) {
  await getTicket(ticketId, companyId);

  return prisma.comment.create({
    data: {
      description: data.description,
      ticketId,
      userId,
    },
    select: {
      id: true,
      description: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

/**
 * Lista todos os comentários de um ticket.
 *
 * @async
 * @function listComments
 * @param {string} ticketId - ID do ticket.
 * @param {string} companyId - ID da empresa.
 *
 * @returns {Promise<Array<Object>>} Lista de comentários.
 *
 * @throws {AppError} Se o ticket não existir.
 */
export async function listComments(ticketId, companyId) {
  await getTicket(ticketId, companyId);

  return prisma.comment.findMany({
    where: { ticketId },
    orderBy: { id: "asc" },
    select: {
      id: true,
      description: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

/**
 * Atualiza um comentário existente.
 *
 * Apenas o autor do comentário pode atualizá-lo.
 *
 * @async
 * @function updateComment
 * @param {string} ticketId - ID do ticket.
 * @param {string} commentId - ID do comentário.
 * @param {string} companyId - ID da empresa.
 * @param {string} userId - ID do usuário autenticado.
 * @param {Object} data - Dados do comentário.
 * @param {string} data.description - Novo conteúdo do comentário.
 *
 * @returns {Promise<Object>} Comentário atualizado.
 *
 * @throws {AppError} Se ticket não existir.
 * @throws {AppError} Se comentário não existir.
 * @throws {AppError} Se usuário não for o autor.
 */
export async function updateComment(
  ticketId,
  commentId,
  companyId,
  userId,
  data
) {
  await getTicket(ticketId, companyId);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      ticketId,
    },
  });

  if (!comment) {
    throw new AppError("comment:error.comment_not_found", 404);
  }

  if (comment.userId !== userId) {
    throw new AppError("comment:error.not_allowed", 403);
  }

  return prisma.comment.update({
    where: { id: commentId },
    data: {
      description: data.description,
    },
    select: {
      id: true,
      description: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

/**
 * Remove um comentário existente.
 *
 * Apenas o autor do comentário pode deletá-lo.
 *
 * @async
 * @function deleteComment
 * @param {string} ticketId - ID do ticket.
 * @param {string} commentId - ID do comentário.
 * @param {string} companyId - ID da empresa.
 * @param {string} userId - ID do usuário autenticado.
 *
 * @returns {Promise<Object>} Mensagem de sucesso.
 *
 * @throws {AppError} Se ticket não existir.
 * @throws {AppError} Se comentário não existir.
 * @throws {AppError} Se usuário não for o autor.
 */
export async function deleteComment(
  ticketId,
  commentId,
  companyId,
  userId
) {
  await getTicket(ticketId, companyId);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      ticketId,
    },
  });

  if (!comment) {
    throw new AppError("comment:error.comment_not_found", 404);
  }

  if (comment.userId !== userId) {
    throw new AppError("comment:error.not_allowed", 403);
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return {
    message: "comment:success.comment_deleted",
  };
}