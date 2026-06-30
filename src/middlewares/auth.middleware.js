import prisma from "../configs/prisma.js";
import { verifyAccessToken } from "../utils/jwt.js";

/**
 * Middleware de autenticação baseado em JWT.
 *
 * Responsável por:
 * - Validar o token Bearer enviado no header Authorization
 * - Decodificar o token de acesso
 * - Buscar o usuário no banco de dados
 * - Anexar os dados do usuário autenticado em req.user
 *
 * Caso o token seja inválido ou o usuário não exista,
 * retorna erro 401 (Unauthorized).
 *
 * @async
 * @function authMiddleware
 * @param {import("express").Request} req - Request do Express.
 * @param {import("express").Response} res - Response do Express.
 * @param {import("express").NextFunction} next - Próximo middleware.
 *
 * @returns {void}
 */
export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: req.t("middleware:token.missing"),
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { department: true },
    });

    if (!user) {
      return res.status(401).json({
        message: req.t("middleware:user.not_found"),
      });
    }

    req.user = {
      id: user.id,
      companyId: user.companyId,
      role: user.role,
      name: user.name,
      departmentId: user.departmentId,
      departmentName: user.department?.name,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: req.t("middleware:token.invalid"),
    });
  }
}