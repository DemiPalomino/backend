import db from "../../config/db.js";

export const permisosService = {
    getAll: async () => {
        try {
            console.log('🔍 Obteniendo todos los permisos...');
            const [rows] = await db.query(`
                SELECT pj.*, per.nombres, per.apellidos, per.dni 
                FROM permisos_justificaciones pj 
                INNER JOIN personas per ON pj.id_persona = per.id_persona
                ORDER BY pj.fecha_solicitud DESC`);
            console.log(`✅ ${rows.length} permisos encontrados`);
            return rows;
        } catch (error) {
            console.error('❌ Error en permisosService.getAll:', error);
            throw new Error(`Error al obtener permisos: ${error.message}`);
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await db.query(`
                SELECT pj.*, per.nombres, per.apellidos, per.dni 
                FROM permisos_justificaciones pj 
                INNER JOIN personas per ON pj.id_persona = per.id_persona 
                WHERE pj.id_permiso = ?`, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error en permisosService.getById:', error);
            throw new Error(`Error al obtener permiso: ${error.message}`);
        }
    },

    create: async (permisoData) => {
        try {
            console.log('📝 Creando permiso con datos:', permisoData);
            
            // ✅ CORREGIDO: Usar los mismos nombres que el frontend
            const { 
                fecha_solicitud, 
                fecha_inicio_ausencia, 
                fecha_fin_ausencia, 
                tipo_permiso, 
                justificacion, 
                estado, 
                id_persona 
            } = permisoData;
            
            // ✅ Convertir fechas al formato correcto
            const fechaSolicitudDate = new Date(fecha_solicitud).toISOString().split('T')[0]; // DATE
            const fechaInicioDatetime = new Date(fecha_inicio_ausencia).toISOString().slice(0, 19).replace('T', ' '); // DATETIME
            const fechaFinDatetime = new Date(fecha_fin_ausencia).toISOString().slice(0, 19).replace('T', ' '); // DATETIME
            
            const [result] = await db.query(
                "INSERT INTO permisos_justificaciones (fecha_solicitud, fecha_inicio_ausencia, fecha_fin_ausencia, tipo_permiso, justificacion, estado, id_persona) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [fechaSolicitudDate, fechaInicioDatetime, fechaFinDatetime, tipo_permiso, justificacion, estado, id_persona]
            );
            
            const nuevoPermiso = {
                id_permiso: result.insertId,
                fecha_solicitud: fechaSolicitudDate,
                fecha_inicio_ausencia: fechaInicioDatetime,
                fecha_fin_ausencia: fechaFinDatetime,
                tipo_permiso,
                justificacion,
                estado,
                id_persona
            };
            
            console.log('✅ Permiso creado con ID:', result.insertId);
            return nuevoPermiso;
        } catch (error) {
            console.error('❌ Error en permisosService.create:', error);
            throw new Error(`Error al crear permiso: ${error.message}`);
        }
    },

    update: async (id, permisoData) => {
        try {
            // ✅ CORREGIDO: Usar los mismos nombres que el frontend
            const { 
                fecha_solicitud, 
                fecha_inicio_ausencia, 
                fecha_fin_ausencia, 
                tipo_permiso, 
                justificacion, 
                estado, 
                id_persona 
            } = permisoData;

            // ✅ Convertir fechas al formato correcto
            const fechaSolicitudDate = new Date(fecha_solicitud).toISOString().split('T')[0];
            const fechaInicioDatetime = new Date(fecha_inicio_ausencia).toISOString().slice(0, 19).replace('T', ' ');
            const fechaFinDatetime = new Date(fecha_fin_ausencia).toISOString().slice(0, 19).replace('T', ' ');

            await db.query(
                "UPDATE permisos_justificaciones SET fecha_solicitud=?, fecha_inicio_ausencia=?, fecha_fin_ausencia=?, tipo_permiso=?, justificacion=?, estado=?, id_persona=? WHERE id_permiso=?",
                [fechaSolicitudDate, fechaInicioDatetime, fechaFinDatetime, tipo_permiso, justificacion, estado, id_persona, id]
            );
            
            return { 
                id_permiso: id,
                fecha_solicitud: fechaSolicitudDate,
                fecha_inicio_ausencia: fechaInicioDatetime,
                fecha_fin_ausencia: fechaFinDatetime,
                tipo_permiso,
                justificacion,
                estado,
                id_persona
            };
        } catch (error) {
            console.error('Error en permisosService.update:', error);
            throw new Error(`Error al actualizar permiso: ${error.message}`);
        }
    },

    remove: async (id) => {
        try {
            await db.query("DELETE FROM permisos_justificaciones WHERE id_permiso = ?", [id]);
            return { message: "Permiso eliminado correctamente" };
        } catch (error) {
            console.error('Error en permisosService.remove:', error);
            throw new Error(`Error al eliminar permiso: ${error.message}`);
        }
    },
};