import db from "../../config/db.js";

export const permisosService = {
    getAll: async (idPersona = null) => {
        try {
            let query = `
                SELECT pj.*, per.nombres, per.apellidos, per.dni 
                FROM permisos_justificaciones pj 
                INNER JOIN personas per ON pj.id_persona = per.id_persona
            `;
            let params = [];
            
            if (idPersona) {
                query += ` WHERE pj.id_persona = ?`;
                params.push(idPersona);
            }
            
            query += ` ORDER BY pj.fecha_solicitud DESC`;
            
            const [rows] = await db.query(query, params);
            return rows;
        } catch (error) {
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
            throw new Error(`Error al obtener permiso: ${error.message}`);
        }
    },

    create: async (permisoData) => {
        try {
       
            const { 
                fecha_solicitud, 
                fecha_inicio_ausencia, 
                fecha_fin_ausencia, 
                tipo_permiso, 
                justificacion, 
                estado, 
                id_persona 
            } = permisoData;

            const fechaSolicitudDate = new Date(fecha_solicitud).toISOString().split('T')[0];
            const fechaInicioDatetime = new Date(fecha_inicio_ausencia).toISOString().slice(0, 19).replace('T', ' ');
            const fechaFinDatetime = new Date(fecha_fin_ausencia).toISOString().slice(0, 19).replace('T', ' ');
            
            const [result] = await db.query(
                "INSERT INTO permisos_justificaciones (fecha_solicitud, fecha_inicio_ausencia, fecha_fin_ausencia, tipo_permiso, justificacion, estado, id_persona) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [fechaSolicitudDate, fechaInicioDatetime, fechaFinDatetime, tipo_permiso, justificacion, estado, id_persona]
            );
            
            const [nuevoPermiso] = await db.query(`
                SELECT pj.*, per.nombres, per.apellidos, per.dni 
                FROM permisos_justificaciones pj 
                INNER JOIN personas per ON pj.id_persona = per.id_persona 
                WHERE pj.id_permiso = ?`, [result.insertId]);
            return nuevoPermiso[0];
        } catch (error) {
            throw new Error(`Error al crear permiso: ${error.message}`);
        }
    },

    update: async (id, permisoData) => {
        try {
            const camposPermitidos = ['estado', 'justificacion'];
            const camposActualizar = {};

            Object.keys(permisoData).forEach(key => {
                if (camposPermitidos.includes(key)) {
                    camposActualizar[key] = permisoData[key];
                }
            });
            
            if (Object.keys(camposActualizar).length === 0) {
                throw new Error('No hay campos válidos para actualizar');
            }
            
            const setClause = Object.keys(camposActualizar).map(key => `${key} = ?`).join(', ');
            const valores = Object.values(camposActualizar);
            valores.push(id);
            
            await db.query(
                `UPDATE permisos_justificaciones SET ${setClause} WHERE id_permiso = ?`,
                valores
            );
            
            // Devolver el permiso actualizado
            return await permisosService.getById(id);
        } catch (error) {
            throw new Error(`Error al actualizar permiso: ${error.message}`);
        }
    },

    remove: async (id) => {
        try {
            await db.query("DELETE FROM permisos_justificaciones WHERE id_permiso = ?", [id]);
            return { message: "Permiso eliminado correctamente" };
        } catch (error) {
            throw new Error(`Error al eliminar permiso: ${error.message}`);
        }
    },
};