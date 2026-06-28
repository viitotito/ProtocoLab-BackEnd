export function authorize() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Usuário não autenticado."
      });
    }

    const isAdminDepartment =
      req.user.departmentName === "Administração";

    const isManager =
      req.user.role === "Gerente";

    if (!isAdminDepartment || !isManager) {
      return res.status(403).json({
        message:
          "Acesso permitido apenas para usuários do departamento de Administração com cargo de Gerente."
      });
    }

    next();
  };
}