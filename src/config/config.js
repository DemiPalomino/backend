import { config } from 'dotenv'
config()
if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET no definido, usando valor por defecto');
}
export const PORT = process.env.PORT || 3000
export const DB_HOST = process.env.DB_HOST || "localhost"
export const DB_PORT = process.env.DB_PORT || 3306
export const DB_USER = process.env.DB_USER || "root"
export const DB_PASSWORD = process.env.DB_PASSWORD || ""
export const DB_DATABASE = process.env.DB_DATABASE || "asisreconofacial"

// token
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES = process.env.JWT_EXPIRES || "1h"

// validando conexión a mi BD
export const validateDBConfig = () => {
    const required = [DB_HOST, DB_USER, DB_DATABASE];
    if (required.some(field => !field)) {
        throw new Error('Configuración de BD incompleta');
    }
};