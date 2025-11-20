import db from "../../config/db.js";

export const asistenciaService = {
    getAll: async () => {
        const [rows] = await db.query("SELECT a.*, p.nombres, p.apellidos, p.dni FROM asistencias a INNER JOIN personas p ON a.id_persona = p.id_persona");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query("SELECT a.*, p.nombres, p.apellidos, p.dni FROM asistencias a INNER JOIN personas p ON a.id_persona = p.id_persona WHERE a.id_asistencia = ?", [id]);
        return rows[0];
    },

    create: async ({ id_persona, fecha_ingreso, metodo_registro, fecha_salida, miniTardanza, hora_entrada, hora_salida }) => {
        const [result] = await db.query(
            "INSERT INTO asistencias (id_persona, fecha_ingreso, metodo_registro, fecha_salida, miniTardanza, hora_entrada, hora_salida) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [id_persona, fecha_ingreso, metodo_registro, fecha_salida, miniTardanza, hora_entrada, hora_salida]
        );
        return {
            id_asistencia: result.insertId,
            id_persona,
            fecha_ingreso,
            metodo_registro,
            fecha_salida,
            miniTardanza,
            hora_entrada,
            hora_salida
        };
    },

    update: async (id, { id_persona, fecha_ingreso, metodo_registro, fecha_salida, miniTardanza, hora_entrada, hora_salida }) => {
        let query = "UPDATE asistencias SET id_persona=?, fecha_ingreso=?, metodo_registro=?, fecha_salida=?, miniTardanza=?, hora_entrada=?, hora_salida=? WHERE id_asistencia=?";
        let params = [id_persona, fecha_ingreso, metodo_registro, fecha_salida, miniTardanza, hora_entrada, hora_salida, id];

        await db.query(query, params);
        return { id, id_persona, fecha_ingreso, metodo_registro, fecha_salida, miniTardanza, hora_entrada, hora_salida };
    },

    remove: async (id) => {
        let query = "DELETE FROM asistencias WHERE id_asistencia = ?";
        let params = [id];
        await db.query(query, params);
        return { message: "Asistencia eliminada" };
    },

    registrarAsistenciaFacial: async (id_persona, metodo_registro = "facial") => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const fecha_actual = new Date();
            const fecha_solo = fecha_actual.toISOString().split('T')[0];


            const [persona] = await connection.query(`
                SELECT p.id_persona, p.activo, h.id_horario
                FROM personas p
                LEFT JOIN horario h ON p.id_horario = h.id_horario
                WHERE p.id_persona = ? AND p.activo = 1
            `, [id_persona]);

            if (persona.length === 0) {
                throw new Error("Persona no encontrada o inactiva");
            }


            const [asistenciaExistente] = await connection.query(`
                SELECT id_asistencia, fecha_ingreso, fecha_salida 
                FROM asistencias 
                WHERE id_persona = ? AND DATE(fecha_ingreso) = ?
                ORDER BY fecha_ingreso DESC LIMIT 1
            `, [id_persona, fecha_solo]);

            let resultado;

            if (asistenciaExistente.length > 0) {
                const ultimaAsistencia = asistenciaExistente[0];


                if (ultimaAsistencia.fecha_salida) {
                    resultado = await asistenciaService.registrarEntrada(
                        connection, id_persona, fecha_actual, metodo_registro
                    );
                } else {

                    resultado = await asistenciaService.registrarSalida(
                        connection, ultimaAsistencia.id_asistencia, fecha_actual
                    );
                }
            } else {

                resultado = await asistenciaService.registrarEntrada(
                    connection, id_persona, fecha_actual, metodo_registro
                );
            }

            await connection.commit();
            return resultado;

        } catch (error) {
            await connection.rollback();
            console.error('Error en transacción de asistencia:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}