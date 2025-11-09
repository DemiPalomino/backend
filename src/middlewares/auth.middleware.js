import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
import db from "../config/db.js";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        if (!token) {
            return res.status(401).json({ 
                error: "Token de autenticación requerido",
                code: "MISSING_TOKEN"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Verificar usuario en BD
        const [users] = await db.query(
            `SELECT u.id_usuario, u.activo, u.id_tipo_usuario, p.nombres, p.apellidos 
             FROM usuarios u 
             LEFT JOIN personas p ON u.id_persona = p.id_persona 
             WHERE u.id_usuario = ? AND u.activo = 1`, 
            [decoded.id]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ 
                error: "Usuario no encontrado o inactivo",
                code: "USER_NOT_FOUND"
            });
        }

        // Agregar información completa del usuario
        req.user = {
            ...decoded,
            ...users[0]
        };
        
        next();
    } catch (error) {
        console.error("❌ Error verificando token:", error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: "Token expirado",
                code: "TOKEN_EXPIRED"
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ 
                error: "Token inválido",
                code: "INVALID_TOKEN"
            });
        }
        
        return res.status(500).json({ 
            error: "Error interno del servidor",
            code: "SERVER_ERROR"
        });
    }
};

// Middleware de roles dinámico
export const requireRole = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }
        
        if (!allowedRoles.includes(req.user.id_tipo_usuario)) {
            return res.status(403).json({ 
                error: "Permisos insuficientes para esta acción",
                requiredRoles: allowedRoles,
                userRole: req.user.id_tipo_usuario
            });
        }
        next();
    };
};

// Roles predefinidos para facilidad
export const requireAdmin = requireRole([1]); // Administrador
export const requireSupervisor = requireRole([2]); // Supervisor  
export const requireEmployee = requireRole([3]); // Empleado
export const requireHR = requireRole([4]); // RRHH