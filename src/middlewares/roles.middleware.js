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