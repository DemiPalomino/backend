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
        // verificando el usuario en BD
        const [users] = await db.query(`
            SELECT 
                u.id_usuario, 
                u.id_tipo_usuario,
                u.id_persona,
                p.nombres, 
                p.apellidos,
                p.dni,
                p.activo as persona_activa
            FROM usuarios u 
            LEFT JOIN personas p ON u.id_persona = p.id_persona 
            WHERE u.id_usuario = ?`, 
            [decoded.id]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ 
                error: "Usuario no encontrado",
                code: "USER_NOT_FOUND"
            });
        }
        const userData = users[0];
        // verificando si la persona está activa
        if (userData.persona_activa !== 1) {
            return res.status(401).json({ 
                error: "Usuario inactivo",
                code: "USER_INACTIVE"
            });
        }

        req.user = {
            id: decoded.id,
            id_usuario: userData.id_usuario,
            id_persona: userData.id_persona,
            id_tipo_usuario: userData.id_tipo_usuario,
            nombres: userData.nombres,
            apellidos: userData.apellidos,
            dni: userData.dni,
            role: userData.id_tipo_usuario 
        };
        next();
    } catch (error) {
        
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

export const requireAdmin = requireRole([1]); 
export const requireEmployee = requireRole([2]);