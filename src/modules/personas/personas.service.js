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

            console.log('📝 Datos recibidos para crear persona:', personaData);

            // ✅ VALIDACIÓN: Verificar que el área existe
            const [areaExists] = await connection.query(
                "SELECT id_area FROM areas_de_trabajo WHERE id_area = ?",
                [id_area_trabajo]
            );

            if (areaExists.length === 0) {
                throw new Error('El área de trabajo seleccionada no existe');
            }

            // ✅ AGREGAR FECHA_INGRESO (campo requerido)
            const fecha_ingreso = new Date().toISOString().split('T')[0]; // Fecha actual

            // ✅ Insertar persona
            const [personaResult] = await connection.query(
                "INSERT INTO personas (dni, nombres, apellidos, email, telefono, fecha_nacimiento, id_area_trabajo, fecha_ingreso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [dni, nombres, apellidos, email, telefono, fecha_nacimiento, id_area_trabajo, fecha_ingreso]
            );

            const id_persona = personaResult.insertId;

            // ✅ Si se proporcionaron datos de usuario, crear usuario
            if (nombre_usuario && contrasena && id_tipo_usuario) {
                // Validar que el tipo de usuario existe
                const [tipoUsuarioExists] = await connection.query(
                    "SELECT id_tipo_usuario FROM tipo_de_usuario WHERE id_tipo_usuario = ?",
                    [id_tipo_usuario]
                );

                if (tipoUsuarioExists.length === 0) {
                    throw new Error('El tipo de usuario seleccionado no existe');
                }

                // Encriptar contraseña
                const hashedPassword = await bcrypt.hash(contrasena, 10);

                await connection.query(
                    "INSERT INTO usuarios (nombre_usuario, contrasena, id_tipo_usuario, id_persona) VALUES (?, ?, ?, ?)",
                    [nombre_usuario, hashedPassword, id_tipo_usuario, id_persona]
                );
            }

            await connection.commit();

            // Obtener la persona recién creada
            const [nuevaPersona] = await connection.query(
                "SELECT p.*, a.nombre_area FROM personas p LEFT JOIN areas_de_trabajo a ON p.id_area_trabajo = a.id_area WHERE p.id_persona = ?",
                [id_persona]
            );

            console.log('✅ Persona creada exitosamente:', nuevaPersona[0]);
            return nuevaPersona[0];
        } catch (error) {
            await connection.rollback();
            console.error('❌ Error en personaService.create:', error);
            
            // ✅ MEJOR MANEJO DE ERRORES ESPECÍFICOS
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El DNI o email ya existe en el sistema');
            }
            if (error.code === 'ER_NO_REFERENCED_ROW') {
                throw new Error('El área de trabajo seleccionada no existe');
            }
            
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