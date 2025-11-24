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
            console.error(' Error en personaService.getAll:', error);
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

            console.log('Datos recibidos para crear persona:', personaData);


            const [areaExists] = await connection.query(
                "SELECT id_area FROM areas_de_trabajo WHERE id_area = ?",
                [id_area_trabajo]
            );

            if (areaExists.length === 0) {
                throw new Error('El área de trabajo seleccionada no existe');
            }

            const fecha_ingreso = new Date().toISOString().split('T')[0];

            const [personaResult] = await connection.query(
                "INSERT INTO personas (dni, nombres, apellidos, email, telefono, fecha_nacimiento, id_area_trabajo, fecha_ingreso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [dni, nombres, apellidos, email, telefono, fecha_nacimiento, id_area_trabajo, fecha_ingreso]
            );

            const id_persona = personaResult.insertId;


            if (nombre_usuario && contrasena && id_tipo_usuario) {

                const [tipoUsuarioExists] = await connection.query(
                    "SELECT id_tipo_usuario FROM tipo_de_usuario WHERE id_tipo_usuario = ?",
                    [id_tipo_usuario]
                );

                if (tipoUsuarioExists.length === 0) {
                    throw new Error('El tipo de usuario seleccionado no existe');
                }

                const hashedPassword = await bcrypt.hash(contrasena, 10);

                await connection.query(
                    "INSERT INTO usuarios (nombre_usuario, contrasena, id_tipo_usuario, id_persona) VALUES (?, ?, ?, ?)",
                    [nombre_usuario, hashedPassword, id_tipo_usuario, id_persona]
                );
            }

            await connection.commit();

            const [nuevaPersona] = await connection.query(
                "SELECT p.*, a.nombre_area FROM personas p LEFT JOIN areas_de_trabajo a ON p.id_area_trabajo = a.id_area WHERE p.id_persona = ?",
                [id_persona]
            );

            console.log('Persona creada exitosamente:', nuevaPersona[0]);
            return nuevaPersona[0];
        } catch (error) {
            await connection.rollback();
            console.error('Error en personaService.create:', error);


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
            console.error('Error en personaService.update:', error);
            throw new Error(`Error al actualizar persona: ${error.message}`);
        }
    },

    remove: async (id) => {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {

            await connection.query(
                "UPDATE personas SET activo = 0 WHERE id_persona = ?",
                [id]
            );


            await connection.query(
                "UPDATE usuarios SET activo = 0 WHERE id_persona = ?",
                [id]
            );

            await connection.commit();
            return { message: "Persona y usuario asociado eliminados correctamente" };
        } catch (error) {
            await connection.rollback();
            console.error('Error en personaService.remove:', error);
            throw new Error(`Error al eliminar persona: ${error.message}`);
        } finally {
            connection.release();
        }
    },

    updateDescriptorFacial: async (id, descriptor) => {
        const [result] = await db.query(
            "UPDATE personas SET descriptor_facial = ? WHERE id_persona = ?",
            [descriptor, id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Persona no encontrada");
        }

        return {
            id_persona: id,
            actualizado: true,
            descriptor_length: descriptor ? JSON.parse(descriptor).length : 0
        };
    },

    getAllDescriptors: async () => {
        try {
            console.log('Buscando empleados con descriptores faciales...');

            const [rows] = await db.query(`
      SELECT id_persona, nombres, apellidos, dni, descriptor_facial 
      FROM personas 
      WHERE activo = 1 AND descriptor_facial IS NOT NULL
    `);

            console.log(`Encontrados ${rows.length} empleados con descriptores`);

            // Verificar que la consulta devuelve resultados
            if (rows.length === 0) {
                console.log('No se encontraron empleados con descriptores faciales');
                return [];
            }

            const result = rows.map(row => {
                try {
                    const descriptor = row.descriptor_facial ? JSON.parse(row.descriptor_facial) : [];

                    // Validar que el descriptor sea un array válido
                    if (!Array.isArray(descriptor) || descriptor.length === 0) {
                        console.warn(`Descriptor inválido para ${row.nombres}`);
                        return {
                            id_persona: row.id_persona,
                            nombres: row.nombres,
                            apellidos: row.apellidos,
                            dni: row.dni,
                            descriptor: []
                        };
                    }

                    return {
                        id_persona: row.id_persona,
                        nombres: row.nombres,
                        apellidos: row.apellidos,
                        dni: row.dni,
                        descriptor: descriptor
                    };
                } catch (parseError) {
                    console.error(`Error parseando descriptor para ${row.nombres}:`, parseError);
                    return {
                        id_persona: row.id_persona,
                        nombres: row.nombres,
                        apellidos: row.apellidos,
                        dni: row.dni,
                        descriptor: []
                    };
                }
            });

            console.log(`Procesados ${result.length} empleados correctamente`);
            return result;

        } catch (error) {
            console.error('Error en getAllDescriptors:', error);
            throw new Error(`Error al obtener descriptores: ${error.message}`);
        }
    },

    getDescriptorFacial: async (id_persona) => {
        const [rows] = await db.query(
            "SELECT descriptor_facial FROM personas WHERE id_persona = ?",
            [id_persona]
        );

        if (rows.length === 0 || !rows[0].descriptor_facial) {
            return null;
        }

        try {
            return JSON.parse(rows[0].descriptor_facial);
        } catch (error) {
            console.error('Error parseando descriptor facial:', error);
            return null;
        }
    }

};