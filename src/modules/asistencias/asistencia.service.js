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

            // Verificar persona activa
            const [persona] = await connection.query(`
                SELECT p.id_persona, p.activo, h.id_horario
                FROM personas p
                LEFT JOIN horario h ON p.id_horario = h.id_horario
                WHERE p.id_persona = ? AND p.activo = 1
            `, [id_persona]);

            if (persona.length === 0) {
                throw new Error("Persona no encontrada o inactiva");
            }

            // Consulta de asistencia existente hoy
            const [asistenciaExistente] = await connection.query(`
                SELECT id_asistencia, fecha_ingreso, fecha_salida 
                FROM asistencias 
                WHERE id_persona = ? AND DATE(fecha_ingreso) = ?
                ORDER BY fecha_ingreso DESC LIMIT 1
            `, [id_persona, fecha_solo]);

            let resultado;
            
            if (asistenciaExistente.length > 0) {
                const ultimaAsistencia = asistenciaExistente[0];
                
                // Si ya tiene salida registrada, crear nueva entrada
                if (ultimaAsistencia.fecha_salida) {
                    resultado = await asistenciaService.registrarEntrada(
                        connection, id_persona, fecha_actual, metodo_registro
                    );
                } else {
                    // Registrar salida
                    resultado = await asistenciaService.registrarSalida(
                        connection, ultimaAsistencia.id_asistencia, fecha_actual
                    );
                }
            } else {
                // No tiene asistencia hoy, registrar entrada
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
    },

    registrarEntrada: async (connection, id_persona, fecha_actual, metodo_registro) => {
        // Obtener horario de la persona
        const [horarioData] = await connection.query(`
            SELECT dh.ingreso_entrada
            FROM personas p
            LEFT JOIN horario h ON p.id_horario = h.id_horario
            LEFT JOIN detalle_de_horario dh ON h.id_horario = dh.id_horario
            WHERE p.id_persona = ? AND dh.dia_semana = DAYOFWEEK(?)
        `, [id_persona, fecha_actual]);

        let miniTardanza = 0;
        
        if (horarioData.length > 0 && horarioData[0].ingreso_entrada) {
            const hora_entrada_programada = new Date(`${fecha_actual.toDateString()} ${horarioData[0].ingreso_entrada}`);
            const diferencia = fecha_actual.getTime() - hora_entrada_programada.getTime();
            miniTardanza = Math.max(0, Math.round(diferencia / (1000 * 60))); // minutos de tardanza
        }

        const [result] = await connection.query(
            `INSERT INTO asistencias 
             (id_persona, fecha_ingreso, metodo_registro, miniTardanza, hora_entrada) 
             VALUES (?, ?, ?, ?, ?)`,
            [id_persona, fecha_actual, metodo_registro, miniTardanza, fecha_actual]
        );

        return {
            tipo: 'entrada',
            id_asistencia: result.insertId,
            fecha_ingreso: fecha_actual,
            miniTardanza,
            mensaje: miniTardanza > 0 
                ? `Entrada registrada con ${miniTardanza} minutos de tardanza` 
                : 'Entrada registrada puntualmente'
        };
    },

    registrarSalida: async (connection, id_asistencia, fecha_actual) => {
        await connection.query(
            `UPDATE asistencias 
             SET fecha_salida = ?, hora_salida = ? 
             WHERE id_asistencia = ?`,
            [fecha_actual, fecha_actual, id_asistencia]
        );

        return {
            tipo: 'salida',
            id_asistencia,
            fecha_salida: fecha_actual,
            mensaje: 'Salida registrada correctamente'
        };
    },

    calcularTardanza: async (id_persona, hora_entrada_real) => {
        const [horario] = await db.query(
            `SELECT dh.ingreso_entrada
             FROM personas p
             LEFT JOIN horario h ON p.id_horario = h.id_horario
             LEFT JOIN detalle_de_horario dh ON h.id_horario = dh.id_horario
             WHERE p.id_persona = ? AND dh.dia_semana = DAYOFWEEK(NOW())`,
            [id_persona]
        );
        
        if (horario.length === 0) return 0;
        
        const hora_entrada_programada = new Date(horario[0].ingreso_entrada);
        const diferencia = hora_entrada_real - hora_entrada_programada;
        const diferenciaEnMinutos = Math.round(diferencia / (1000 * 60));
        
        return Math.max(0, diferenciaEnMinutos);
    }
};