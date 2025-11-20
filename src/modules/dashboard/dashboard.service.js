import db from "../../config/db.js";

export const dashboardService = {
    getEstadisticas: async () => {
        const [totalEmpleados] = await db.query("SELECT COUNT(*) as total FROM personas WHERE activo = 1");
        const [asistenciasHoy] = await db.query("SELECT COUNT(*) as total FROM asistencias WHERE DATE(fecha_ingreso) = CURDATE()");
        const [ausentesHoy] = await db.query(`
            SELECT COUNT(*) as total FROM personas p 
            WHERE p.activo = 1 AND p.id_persona NOT IN (
                SELECT a.id_persona FROM asistencias a 
                WHERE DATE(a.fecha_ingreso) = CURDATE()
            )
        `);
        const [tardanzasHoy] = await db.query("SELECT COUNT(*) as total FROM asistencias WHERE DATE(fecha_ingreso) = CURDATE() AND miniTardanza > 0");

        return {
            totalEmpleados: totalEmpleados[0].total,
            asistenciasHoy: asistenciasHoy[0].total,
            ausentesHoy: ausentesHoy[0].total,
            tardanzasHoy: tardanzasHoy[0].total
        };
    },

    generarReporteAsistencias: async (fecha_inicio, fecha_fin, id_area = null) => {
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

        query += " ORDER BY a.fecha_ingreso DESC";

        const [rows] = await db.query(query, params);
        return rows;
    },

    getTardanzasDelDia: async () => {
        const [rows] = await db.query(`
        SELECT p.nombres, p.apellidos, a.miniTardanza 
        FROM asistencias a 
        INNER JOIN personas p ON a.id_persona = p.id_persona 
        WHERE DATE(a.fecha_ingreso) = CURDATE() AND a.miniTardanza > 0
    `);
        return rows;
    }
};