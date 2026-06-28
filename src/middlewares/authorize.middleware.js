export function authorize() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Usuário não autenticado.",
      });
    }

    const role = (req.user.role || "").toLowerCase().trim();
    const department = (req.user.departmentName || "").toLowerCase().trim();

    const isAdminDepartment = department === "administração";
    const isManager = role === "gerente";

    if (!(isAdminDepartment && isManager)) {
      return res.status(403).json({
        message:
          "Acesso permitido apenas para usuários do departamento de Administração com cargo de Gerente.",
      });
    }

    next();
  };
}