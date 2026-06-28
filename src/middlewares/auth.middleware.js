import { verifyAccessToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token de acesso não informado.",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      companyId: payload.companyId,
      role: payload.role,
      name: payload.name,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token de acesso inválido ou expirado.",
    });
  }
}