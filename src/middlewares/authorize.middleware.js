/**
 * Middleware de autorização baseado em roles (RBAC).
 *
 * Permite acesso apenas para usuários com permissões específicas.
 * Atualmente suporta:
 * - ADMIN
 * - GERENTE
 *
 * Caso o usuário não tenha permissão, retorna erro 403 (Forbidden).
 *
 * @function authorize
 *
 * @returns {Function} Middleware Express (req, res, next).
 */
export function authorize() {
  return (req, res, next) => {
    const role = req.user.role?.toUpperCase();

    const allowedRoles = ["ADMIN", "GERENTE"];

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: req.t("middleware:user.only_admin_manager"),
      });
    }

    next();
  };
}