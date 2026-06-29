import prisma from "../configs/prisma.js";

import { verifyAccessToken } from "../utils/jwt.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token de acesso não informado.",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        department: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Usuário não encontrado.",
      });
    }

    req.user = {
      id: user.id,
      companyId: user.companyId,
      role: user.role,
      name: user.name,
      departmentId: user.departmentId,
      departmentName: user.department.name,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token de acesso inválido ou expirado.",
    });
  }
}