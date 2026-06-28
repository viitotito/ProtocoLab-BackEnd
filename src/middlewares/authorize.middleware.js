export function authorize() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Usuário não autenticado.",
      });
    }

    const role = (req.user.role || "").toLowerCase();
    const department = (req.user.departmentName || "").toLowerCase();

    const isAdminDepartment =
      department === "administração".toLowerCase();

    const isManager =
      role === "gerente".toLowerCase();

    if (!isAdminDepartment || !isManager) {
      return res.status(403).json({
        message:
          "Acesso permitido apenas para usuários do departamento de Administração com cargo de Gerente.",
      });
    }

    next();
  };
}