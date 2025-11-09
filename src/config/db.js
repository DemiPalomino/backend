import { createPool } from 'mysql2/promise';
import { 
    DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER 
} from './config.js';

// Configuración mínima y compatible
const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE,
    
    // Solo opciones esenciales
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

// Manejo mejorado de errores
pool.on('connection', (connection) => {
    console.log('✅ Nueva conexión MySQL establecida - ID:', connection.threadId);
});

pool.on('acquire', (connection) => {
    console.log('🔗 Conexión adquirida - ID:', connection.threadId);
});

pool.on('release', (connection) => {
    console.log('🔄 Conexión liberada - ID:', connection.threadId);
});

pool.on('error', (err) => {
    console.error('❌ Error de MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconectando a la base de datos...');
    }
});

// Función para verificar conexión
export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a BD verificada correctamente');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error conectando a BD:', error.message);
        return false;
    }
};

export default pool;