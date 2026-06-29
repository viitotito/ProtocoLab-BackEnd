export function authorize() {
  return (req, res, next) => {
    const role = req.user.role?.toUpperCase();

    const allowedRoles = ["ADMIN", "GERENTE"];

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: req.t("middleware:only_admin_manager"),
      });
    }

    next();
  };
}