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
    },

    reconocerYRegistrarAsistencia: async (descriptorCapturado) => {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // 1. Obtener todos los descriptores de empleados activos
            const [empleados] = await connection.query(`
                SELECT 
                    p.id_persona,
                    p.nombres,
                    p.apellidos,
                    p.dni,
                    p.descriptor_facial,
                    p.id_horario
                FROM personas p 
                WHERE p.activo = 1 
                AND p.descriptor_facial IS NOT NULL
                AND p.descriptor_facial != 'null'
                AND TRIM(p.descriptor_facial) != ''
            `);

            if (empleados.length === 0) {
                throw new Error('No hay empleados con rostros registrados en el sistema');
            }

            // 2. Buscar coincidencia
            let empleadoReconocido = null;
            let mejorSimilitud = 1; // FaceAPI usa distancia euclidiana (menor = mejor)

            for (const empleado of empleados) {
                try {
                    const descriptorBD = typeof empleado.descriptor_facial === 'string' 
                        ? JSON.parse(empleado.descriptor_facial)
                        : empleado.descriptor_facial;

                    if (!Array.isArray(descriptorBD)) continue;

                    // Calcular similitud (distancia euclidiana)
                    let distancia = 0;
                    for (let i = 0; i < descriptorCapturado.length; i++) {
                        const diff = descriptorCapturado[i] - descriptorBD[i];
                        distancia += diff * diff;
                    }
                    distancia = Math.sqrt(distancia);

                    console.log(`Comparando con ${empleado.nombres}: ${distancia}`);

                    // Umbral óptimo: 0.45 - 0.6
                    if (distancia < 0.6 && distancia < mejorSimilitud) {
                        mejorSimilitud = distancia;
                        empleadoReconocido = {
                            ...empleado,
                            similitud: distancia
                        };
                    }
                } catch (error) {
                    console.error(`Error procesando descriptor de ${empleado.nombres}:`, error);
                    continue;
                }
            }

            if (!empleadoReconocido) {
                throw new Error('No se reconoció el rostro. Verifica la iluminación o registra tu rostro primero.');
            }

            console.log(`✅ Empleado reconocido: ${empleadoReconocido.nombres} (similitud: ${mejorSimilitud})`);

            // 3. Registrar asistencia
            const fecha_actual = new Date();
            const fecha_solo = fecha_actual.toISOString().split('T')[0];

            // Verificar si ya tiene entrada hoy
            const [asistenciaExistente] = await connection.query(
                `SELECT id_asistencia, fecha_ingreso, fecha_salida 
                 FROM asistencias 
                 WHERE id_persona = ? AND DATE(fecha_ingreso) = ?
                 ORDER BY fecha_ingreso DESC LIMIT 1`,
                [empleadoReconocido.id_persona, fecha_solo]
            );

            let resultado;

            if (asistenciaExistente.length > 0 && !asistenciaExistente[0].fecha_salida) {
                // Registrar salida
                resultado = await asistenciaService.registrarSalida(
                    connection, 
                    asistenciaExistente[0].id_asistencia, 
                    fecha_actual
                );
            } else {
                // Registrar entrada
                resultado = await asistenciaService.registrarEntrada(
                    connection,
                    empleadoReconocido.id_persona,
                    fecha_actual,
                    'reconocimientoFacial'
                );
            }

            await connection.commit();

            return {
                ...resultado,
                persona: {
                    id_persona: empleadoReconocido.id_persona,
                    nombres: empleadoReconocido.nombres,
                    apellidos: empleadoReconocido.apellidos,
                    dni: empleadoReconocido.dni
                },
                similitud: mejorSimilitud
            };

        } catch (error) {
            await connection.rollback();
            console.error('Error en reconocimiento facial:', error);
            throw error;
        } finally {
            connection.release();
        }
    },

    registrarEntrada: async (connection, id_persona, fecha_actual, metodo_registro) => {
       
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
    },
    obtenerDescriptoresEmpleados: async () => {
    try {
        console.log('Buscando empleados con descriptores faciales...');
        
        
        const [rows] = await db.query(`
            SELECT 
                p.id_persona,
                p.nombres,
                p.apellidos, 
                p.dni,
                p.descriptor_facial as descriptor
            FROM personas p 
            WHERE p.activo = 1 
            AND p.descriptor_facial IS NOT NULL
            AND TRIM(p.descriptor_facial) != ''
            AND p.descriptor_facial != 'null'
        `);
        
        console.log(`Encontrados ${rows.length} empleados con descriptores`);
        
        if (rows.length === 0) {
            console.log('No se encontraron empleados con descriptores faciales');
            return [];
        }
        
 
        const empleadosConDescriptores = rows.map(emp => {
            try {
                console.log(`Procesando descriptor para ${emp.nombres}:`, emp.descriptor);
                
                if (!emp.descriptor) {
                    console.warn(`Descriptor vacío para empleado ${emp.id_persona}`);
                    return null;
                }
                
                let descriptorArray;
                
                if (typeof emp.descriptor === 'string') {
                   
                    const descriptorLimpio = emp.descriptor.trim();
                    descriptorArray = JSON.parse(descriptorLimpio);
                } else {
                    descriptorArray = emp.descriptor;
                }
        
                if (Array.isArray(descriptorArray) && descriptorArray.length > 0) {
                    console.log(`Descriptor válido para ${emp.nombres}: ${descriptorArray.length} elementos`);
                    return {
                        id_persona: emp.id_persona,
                        nombres: emp.nombres,
                        apellidos: emp.apellidos,
                        dni: emp.dni,
                        descriptor: descriptorArray
                    };
                } else {
                    console.warn(`Descriptor no es array válido para empleado ${emp.id_persona}`);
                    return null;
                }
            } catch (parseError) {
                console.error(`Error parseando descriptor para empleado ${emp.id_persona}:`, parseError);
                console.error(`Descriptor problemático:`, emp.descriptor);
                return null;
            }
        }).filter(emp => emp !== null);
        
        console.log(`Finalmente ${empleadosConDescriptores.length} empleados con descriptores válidos`);
        return empleadosConDescriptores;
        
    } catch (error) {
        console.error('Error en obtenerDescriptoresEmpleados:', error);
      
        return [];
    }
},

    
    registrarDescriptorFacial: async (id_persona, descriptor) => {
        const descriptorString = JSON.stringify(descriptor);

        const [result] = await db.query(
            "UPDATE personas SET descriptor_facial = ? WHERE id_persona = ?",
            [descriptorString, id_persona]
        );

        return result;
    }

};