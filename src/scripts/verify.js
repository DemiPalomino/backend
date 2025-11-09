import { testConnection } from '../config/db.js';
import { validateDBConfig } from '../config/config.js';

const verifySetup = async () => {
    console.log('🔍 Verificando configuración del backend...\n');
    
    try {
        // 1. Verificar configuración de BD
        validateDBConfig();
        console.log('✅ Configuración de BD: OK');
        
        // 2. Verificar conexión a BD
        const dbConnected = await testConnection();
        if (!dbConnected) {
            throw new Error('No se pudo conectar a la base de datos');
        }
        
        // 3. Verificar variables críticas
        if (process.env.JWT_SECRET === "fallback_secret_development_change_in_production") {
            console.warn('⚠️  Usando JWT_SECRET por defecto - Cambia en producción');
        }
        
        console.log('\n🎉 ¡Backend verificado correctamente!');
        console.log('📊 Próximos pasos:');
        console.log('   1. Configurar variables de entorno en .env');
        console.log('   2. Ejecutar migraciones de BD si es necesario');
        console.log('   3. Probar endpoints con Postman');
        
    } catch (error) {
        console.error('\n❌ Error en verificación:', error.message);
        process.exit(1);
    }
};

verifySetup();