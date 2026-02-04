/**
 * Zod Validation Middleware Factory
 * Creates middleware that validates request body against a Zod schema
 */
const validate = (schema) => {
    return (req, res, next) => {
        try {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                // Zod 4 uses 'issues' instead of 'errors'
                const issues = result.error.issues || result.error.errors || [];
                const errors = issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Validation failed',
                        code: 'VALIDATION_ERROR',
                        statusCode: 400,
                        details: errors
                    }
                });
            }

            // Replace body with validated and transformed data
            req.body = result.data;
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = validate;
