export const validate = (schemaFn) => (req, res, next) => {
  const t = req.t;

  const schema = schemaFn(t); 

  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: t("middleware:invalid_fields"),
      errors: result.error.flatten(),
    });
  }

  req.body = result.data;
  next();
};