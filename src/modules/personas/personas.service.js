import db from "../../config/db.js";
import bcrypt from "bcryptjs";

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
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const { dni, nombres, apellidos, email, telefono, fecha_nacimiento, id_area_trabajo, nombre_usuario, contrasena, id_tipo_usuario } = personaData;

            // ✅ VALIDACIÓN MEJORADA: Verificar que el área existe
            const [areaExists] = await connection.query(
                "SELECT id_area FROM areas_de_trabajo WHERE id_area = ? AND activo = 1",
                [id_area_trabajo]
            );

            if (areaExists.length === 0) {
                throw new Error('El área de trabajo seleccionada no existe o está inactiva');
            }

            // ... resto del código existente
        } catch (error) {
            await connection.rollback();
            console.error('❌ Error en personaService.create:', error);
            throw new Error(`Error al crear persona: ${error.message}`);
        } finally {
            connection.release();
        }
    },

    update: async (id, personaData) => {
        try {
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
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // ✅ Borrado lógico de persona
            await connection.query(
                "UPDATE personas SET activo = 0 WHERE id_persona = ?",
                [id]
            );

            // ✅ Desactivar usuario asociado
            await connection.query(
                "UPDATE usuarios SET activo = 0 WHERE id_persona = ?",
                [id]
            );

            await connection.commit();
            return { message: "Persona y usuario asociado eliminados correctamente" };
        } catch (error) {
            await connection.rollback();
            console.error('❌ Error en personaService.remove:', error);
            throw new Error(`Error al eliminar persona: ${error.message}`);
        } finally {
            connection.release();
        }
    }
};