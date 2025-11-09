import Joi from 'joi'; 

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                error: error.details[0].message,
                details: error.details.map(detail => ({
                    field: detail.path[0],
                    message: detail.message
                }))
            });
        }
        next();
    };
};

// Esquemas de validación mejorados
export const areaSchema = Joi.object({
    nombre_area: Joi.string().min(2).max(100).required().messages({
        'string.min': 'El nombre del área debe tener al menos 2 caracteres',
        'string.max': 'El nombre del área no puede exceder 100 caracteres',
        'any.required': 'El nombre del área es requerido'
    }),
    descripcion: Joi.string().max(255).optional().allow('')
});

export const userSchema = Joi.object({
    nombre_usuario: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    id_tipo_usuario: Joi.number().integer().min(1).required()
});

export const personaSchema = Joi.object({
    dni: Joi.string().length(8).pattern(/^[0-9]+$/).required(),
    nombres: Joi.string().min(2).max(100).required(),
    apellidos: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().optional().allow(''),
    phone: Joi.string().pattern(/^[0-9]+$/).optional().allow(''),
    fecha_nace: Joi.date().max('now').required(),
    id_area: Joi.number().integer().min(1).required()
});