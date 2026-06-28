export function authorize(...allowedRoles) {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        error: "Usuário não autenticado."
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Você não possui permissão para acessar este recurso."
      });
    }

    next();
  };
}