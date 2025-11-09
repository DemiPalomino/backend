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
//

export default pool;