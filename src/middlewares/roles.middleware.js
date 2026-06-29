export function roles() {
  return (req, res, next) => {
    const requesterRole = req.user.role?.toUpperCase();
    const roleToAssign = req.body.role?.toUpperCase();

    if (requesterRole === "ADMIN") {
      return next(); 
    }

    if (requesterRole === "GERENTE") {
      if (roleToAssign === "ADMIN") {
        return res.status(403).json({
          message: "Gerente não pode criar usuário ADMIN.",
        });
      }

      return next(); 
    }

    return res.status(403).json({
      message: "Você não tem permissão para criar usuários.",
    });
  };
}