import db from "../../config/db.js";

export const dashboardService = {
    getEstadisticas: async (userId, userRole, idPersona) => {
        try {
            if (userRole === 2) {
                const [asistenciasHoy] = await db.query(`
                    SELECT COUNT(*) as total FROM asistencias 
                    WHERE DATE(fecha_ingreso) = CURDATE() AND id_persona = ?
                `, [idPersona]);
                
                const [tardanzasHoy] = await db.query(`
                    SELECT COUNT(*) as total FROM asistencias 
                    WHERE DATE(fecha_ingreso) = CURDATE() AND id_persona = ? AND miniTardanza > 0
                `, [idPersona]);

                return {
                    totalEmpleados: 1,
                    asistenciasHoy: asistenciasHoy[0].total,
                    ausentesHoy: asistenciasHoy[0].total > 0 ? 0 : 1,
                    tardanzasHoy: tardanzasHoy[0].total
                };
            } else {
                const [totalEmpleados] = await db.query(
                    "SELECT COUNT(*) as total FROM personas WHERE activo = 1"
                );
                const [asistenciasHoy] = await db.query(
                    "SELECT COUNT(*) as total FROM asistencias WHERE DATE(fecha_ingreso) = CURDATE()"
                );
                const [ausentesHoy] = await db.query(`
                    SELECT COUNT(*) as total FROM personas p 
                    WHERE p.activo = 1 AND p.id_persona NOT IN (
                        SELECT a.id_persona FROM asistencias a 
                        WHERE DATE(a.fecha_ingreso) = CURDATE()
                    )
                `);
                
                const [tardanzasHoy] = await db.query(
                    "SELECT COUNT(*) as total FROM asistencias WHERE DATE(fecha_ingreso) = CURDATE() AND miniTardanza > 0"
                );

                return {
                    totalEmpleados: totalEmpleados[0].total,
                    asistenciasHoy: asistenciasHoy[0].total,
                    ausentesHoy: ausentesHoy[0].total,
                    tardanzasHoy: tardanzasHoy[0].total
                };
            }
        } catch (error) {
            throw error;
        }
    },

    getEstadisticasEmpleado: async (idPersona) => {
    try {
        // Asistencia de hoy
        const [asistenciaHoy] = await db.query(`
            SELECT * FROM asistencias 
            WHERE DATE(fecha_ingreso) = CURDATE() AND id_persona = ?
            ORDER BY fecha_ingreso DESC LIMIT 1
        `, [idPersona]);
        
        // Tardanzas del mes
        const [tardanzasMes] = await db.query(`
            SELECT COUNT(*) as total FROM asistencias 
            WHERE id_persona = ? AND MONTH(fecha_ingreso) = MONTH(CURDATE()) 
            AND YEAR(fecha_ingreso) = YEAR(CURDATE()) AND miniTardanza > 0
        `, [idPersona]);
        
        // Asistencias del mes
        const [asistenciasMes] = await db.query(`
            SELECT COUNT(*) as total FROM asistencias 
            WHERE id_persona = ? AND MONTH(fecha_ingreso) = MONTH(CURDATE()) 
            AND YEAR(fecha_ingreso) = YEAR(CURDATE())
        `, [idPersona]);

        return {
            asistenciaHoy: asistenciaHoy[0] || null,
            tardanzasMes: tardanzasMes[0].total,
            asistenciasMes: asistenciasMes[0].total,
            fechaConsulta: new Date()
        };
    } catch (error) {
        throw error;
    }
},

    getAreasConEmpleados: async () => {
        try {
            const [areas] = await db.query(`
                SELECT 
                    a.id_area,
                    a.nombre_area,
                    a.descripcion,
                    COUNT(p.id_persona) as cantidad_empleados
                FROM areas_de_trabajo a
                LEFT JOIN personas p ON a.id_area = p.id_area_trabajo AND p.activo = 1
                GROUP BY a.id_area, a.nombre_area, a.descripcion
                ORDER BY a.nombre_area
            `);
            return areas;
        } catch (error) {
            throw error;
        }
    },

    generarReporteAsistencias: async (fecha_inicio, fecha_fin, id_area = null, idPersona = null) => {
        try {
            let query = `
                SELECT a.*, p.nombres, p.apellidos, p.dni, ar.nombre_area 
                FROM asistencias a 
                INNER JOIN personas p ON a.id_persona = p.id_persona 
                INNER JOIN areas_de_trabajo ar ON p.id_area_trabajo = ar.id_area 
                WHERE DATE(a.fecha_ingreso) BETWEEN ? AND ?
            `;
            let params = [fecha_inicio, fecha_fin];

            if (id_area) {
                query += " AND p.id_area_trabajo = ?";
                params.push(id_area);
            }

            if (idPersona) {
                query += " AND a.id_persona = ?";
                params.push(idPersona);
            }

            query += " ORDER BY a.fecha_ingreso DESC";

            const [rows] = await db.query(query, params);
            return rows;
        } catch (error) {
            throw error;
        }
    }
};