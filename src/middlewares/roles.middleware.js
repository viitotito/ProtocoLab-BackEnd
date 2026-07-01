/**
 * Middleware de controle de permissões para atribuição de roles (RBAC).
 *
 * Define regras de quem pode atribuir determinados papéis no sistema:
 *
 * Regras:
 * - ADMIN: pode atribuir qualquer role
 * - GERENTE: não pode criar usuários ADMIN
 * - Outros usuários: não possuem permissão
 *
 * Baseia-se no role do usuário autenticado (req.user)
 * e no role enviado no body da requisição (req.body.role).
 *
 * @function roles
 *
 * @returns {Function} Middleware Express (req, res, next)
 */
export function roles() {
  return (req, res, next) => {
    const requesterRole = req.user.role?.toUpperCase();
    const roleToAssign = req.body.role?.toUpperCase();

    if (requesterRole === "ADMIN") {
      return next();
    }

    if (requesterRole === "MANAGER") {
      if (roleToAssign === "ADMIN") {
        return res.status(403).json({
          message: req.t("middleware:user.cannot_create_admin"),
        });
      }

      return next();
    }

    return res.status(403).json({
      message: req.t("middleware:user.no_permission"),
    });
  };
}