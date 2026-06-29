export function authorize() {
  return (req, res, next) => {
    const role = req.user.role?.toUpperCase();
    const departmentName = req.user.departmentName?.toUpperCase();

    const allowedRoles = ["ADMIN", "GERENTE"];

    if (!(allowedRoles.includes(role))) {
      return res.status(403).json({
        message:
          "Acesso permitido apenas para o Admin ou Gerente.",
      });
    }

    next();
  };
}