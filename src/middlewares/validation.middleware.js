export function validate(schema) {

    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            return res.status(400).json({
                error: "Erro de validação.",
                fields: result.error.flatten().fieldErrors
            });

        }

        req.body = result.data;

        next();
    };
}