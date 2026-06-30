import prisma from "../configs/prisma.js";

/**
 * Busca um ticket garantindo que ele pertence à empresa informada.
 *
 * @async
 * @function getTicket
 * @param {string} ticketId - ID do ticket.
 * @param {string} companyId - ID da empresa.
 * @param {Function} t - Função de tradução i18n.
 *
 * @returns {Promise<Object>} Ticket encontrado.
 *
 * @throws {Error} Se o ticket não existir ou não pertencer à empresa.
 */
async function getTicket(ticketId, companyId, t) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      department: {
        companyId,
      },
    },
  });

  if (!ticket) {
    throw new Error(t("comment:error.ticket_not_found"));
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
 * @param {Function} t - Função de tradução i18n.
 *
 * @returns {Promise<Object>} Comentário criado com dados do usuário.
 *
 * @throws {Error} Se o ticket não existir.
 */
export async function createComment(ticketId, userId, companyId, data, t) {
  await getTicket(ticketId, companyId, t);

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
 * @param {Function} t - Função de tradução i18n.
 *
 * @returns {Promise<Array<Object>>} Lista de comentários.
 *
 * @throws {Error} Se o ticket não existir.
 */
export async function listComments(ticketId, companyId, t) {
  await getTicket(ticketId, companyId, t);

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
 * @param {Function} t - Função de tradução i18n.
 *
 * @returns {Promise<Object>} Comentário atualizado.
 *
 * @throws {Error} Se ticket não existir.
 * @throws {Error} Se comentário não existir.
 * @throws {Error} Se usuário não for o autor.
 */
export async function updateComment(
  ticketId,
  commentId,
  companyId,
  userId,
  data,
  t
) {
  await getTicket(ticketId, companyId, t);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      ticketId,
    },
  });

  if (!comment) {
    throw new Error(t("comment:error.comment_not_found"));
  }

  if (comment.userId !== userId) {
    throw new Error(t("comment:error.not_allowed"));
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
 * @param {Function} t - Função de tradução i18n.
 *
 * @returns {Promise<Object>} Mensagem de sucesso.
 *
 * @throws {Error} Se ticket não existir.
 * @throws {Error} Se comentário não existir.
 * @throws {Error} Se usuário não for o autor.
 */
export async function deleteComment(
  ticketId,
  commentId,
  companyId,
  userId,
  t
) {
  await getTicket(ticketId, companyId, t);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      ticketId,
    },
  });

  if (!comment) {
    throw new Error(t("comment:error.comment_not_found"));
  }

  if (comment.userId !== userId) {
    throw new Error(t("comment:error.not_allowed"));
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return {
    message: t("comment:success.comment_deleted"),
  };
}