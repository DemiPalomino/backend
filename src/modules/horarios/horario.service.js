import db from "../../config/db.js";

export const horarioService = {
    getAll: async () => {
        try {
            console.log('🔍 Obteniendo todos los horarios...');
            const [rows] = await db.query(`
                SELECT 
                    h.id_horario,
                    h.nombre_horario,
                    h.hora_entrada,
                    h.hora_salida,
                    h.id_area_trabajo,
                    h.estado,
                    a.nombre_area 
                FROM horario h 
                LEFT JOIN areas_de_trabajo a ON h.id_area_trabajo = a.id_area
                ORDER BY h.nombre_horario
            `);
            console.log(`✅ ${rows.length} horarios encontrados`);
            return rows;
        } catch (error) {
            console.error('❌ Error en horarioService.getAll:', error);
            throw new Error(`Error al obtener horarios: ${error.message}`);
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await db.query(`
                SELECT 
                    h.id_horario,
                    h.nombre_horario,
                    h.hora_entrada,
                    h.hora_salida,
                    h.id_area_trabajo,
                    h.estado,
                    a.nombre_area 
                FROM horario h 
                LEFT JOIN areas_de_trabajo a ON h.id_area_trabajo = a.id_area 
                WHERE h.id_horario = ?
            `, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error en horarioService.getById:', error);
            throw new Error(`Error al obtener horario: ${error.message}`);
        }
    },

    create: async (horarioData) => {
        try {
            console.log('📝 Creando horario con datos:', horarioData);
            const { nombre_horario, hora_entrada, hora_salida, id_area_trabajo, estado = 1 } = horarioData;
            
            const [result] = await db.query(
                "INSERT INTO horario (nombre_horario, hora_entrada, hora_salida, id_area_trabajo, estado) VALUES (?, ?, ?, ?, ?)",
                [nombre_horario, hora_entrada, hora_salida, id_area_trabajo, estado]
            );
            
            const nuevoHorario = {
                id_horario: result.insertId,
                nombre_horario,
                hora_entrada,
                hora_salida,
                id_area_trabajo,
                estado
            };
            
            console.log('✅ Horario creado con ID:', result.insertId);
            return nuevoHorario;
        } catch (error) {
            console.error('❌ Error en horarioService.create:', error);
            throw new Error(`Error al crear horario: ${error.message}`);
        }
    },

    update: async (id, horarioData) => {
        try {
            const { nombre_horario, hora_entrada, hora_salida, id_area_trabajo, estado } = horarioData;
            
            await db.query(
                "UPDATE horario SET nombre_horario=?, hora_entrada=?, hora_salida=?, id_area_trabajo=?, estado=? WHERE id_horario=?",
                [nombre_horario, hora_entrada, hora_salida, id_area_trabajo, estado, id]
            );
            
            return { 
                id_horario: id,
                nombre_horario, 
                hora_entrada, 
                hora_salida, 
                id_area_trabajo,
                estado
            };
        } catch (error) {
            console.error('Error en horarioService.update:', error);
            throw new Error(`Error al actualizar horario: ${error.message}`);
        }
    },

    remove: async (id) => {
        try {
            await db.query("DELETE FROM horario WHERE id_horario = ?", [id]);
            return { message: "Horario eliminado correctamente" };
        } catch (error) {
            console.error('Error en horarioService.remove:', error);
            throw new Error(`Error al eliminar horario: ${error.message}`);
        }
    },
};