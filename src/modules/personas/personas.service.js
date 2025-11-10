import db from "../../config/db.js";

export const personaService = {
    getAll: async () => {
        try {
            const [rows] = await db.query(
                "SELECT p.*, a.nombre_area FROM personas p LEFT JOIN areas_de_trabajo a ON p.id_area_trabajo = a.id_area WHERE p.activo = 1"
            );
            return rows;
        } catch (error) {
            console.error('❌ Error en personaService.getAll:', error);
            throw new Error(`Error al obtener personas: ${error.message}`);
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await db.query(
                "SELECT p.*, a.nombre_area FROM personas p LEFT JOIN areas_de_trabajo a ON p.id_area_trabajo = a.id_area WHERE p.id_persona = ?", 
                [id]
            );
            return rows[0];
        } catch (error) {
            throw new Error(`Error al obtener persona: ${error.message}`);
        }
    },

    create: async (personaData) => {
        try {
            // ✅ CORREGIDO: Usa los nombres correctos de campos
            const { dni, nombres, apellidos, email, telefono, fecha_nacimiento, id_area_trabajo } = personaData;
            
            const [result] = await db.query(
                "INSERT INTO personas (dni, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, id_area_trabajo) VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE, ?)",
                [dni, nombres, apellidos, email, telefono, fecha_nacimiento, id_area_trabajo]
            );
            
            return { id: result.insertId, ...personaData };
        } catch (error) {
            console.error('❌ Error en personaService.create:', error);
            throw new Error(`Error al crear persona: ${error.message}`);
        }
    },

    update: async (id, personaData) => {
        try {
            // ✅ CORREGIDO: Campos correctos
            const { dni, nombres, apellidos, email, telefono, fecha_nacimiento, id_area_trabajo } = personaData;
            
            await db.query(
                "UPDATE personas SET dni=?, nombres=?, apellidos=?, email=?, telefono=?, fecha_nacimiento=?, id_area_trabajo=? WHERE id_persona=?",
                [dni, nombres, apellidos, email, telefono, fecha_nacimiento, id_area_trabajo, id]
            );
            
            return { id, ...personaData };
        } catch (error) {
            console.error('❌ Error en personaService.update:', error);
            throw new Error(`Error al actualizar persona: ${error.message}`);
        }
    },

    remove: async (id) => {
        try {
            // ✅ CORREGIDO: Borrado lógico en lugar de físico
            await db.query(
                "UPDATE personas SET activo = 0 WHERE id_persona = ?",
                [id]
            );
            return { message: "Persona eliminada correctamente" };
        } catch (error) {
            console.error('❌ Error en personaService.remove:', error);
            throw new Error(`Error al eliminar persona: ${error.message}`);
        }
    }
};