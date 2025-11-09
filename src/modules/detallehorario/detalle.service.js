import db from "../../config/db.js";

export const detalleHorarioService = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT dh.*, h.nombre_horario, a.nombre_area 
            FROM detalle_de_horario dh 
            INNER JOIN horario h ON dh.id_horario = h.id_horario 
            INNER JOIN areas_de_trabajo a ON h.id_area_trabajo = a.id_area
        `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT dh.*, h.nombre_horario, a.nombre_area 
            FROM detalle_de_horario dh 
            INNER JOIN horario h ON dh.id_horario = h.id_horario 
            INNER JOIN areas_de_trabajo a ON h.id_area_trabajo = a.id_area 
            WHERE dh.id_detalle_horario = ?
        `, [id]);
        return rows[0];
    },

    create: async ({ ingreso_entrada, ingreso_salida, id_horario, dia_semana }) => {
        const [result] = await db.query(
            "INSERT INTO detalle_de_horario (ingreso_entrada, ingreso_salida, id_horario, dia_semana) VALUES (?, ?, ?, ?)",
            [ingreso_entrada, ingreso_salida, id_horario, dia_semana]
        );
        return { 
            id_detalle_horario: result.insertId, 
            ingreso_entrada, 
            ingreso_salida, 
            id_horario, 
            dia_semana 
        };
    },

    update: async (id, { ingreso_entrada, ingreso_salida, id_horario, dia_semana }) => {
        const query = "UPDATE detalle_de_horario SET ingreso_entrada=?, ingreso_salida=?, id_horario=?, dia_semana=? WHERE id_detalle_horario=?";
        const params = [ingreso_entrada, ingreso_salida, id_horario, dia_semana, id];
        
        await db.query(query, params);
        return { 
            id, 
            ingreso_entrada, 
            ingreso_salida, 
            id_horario, 
            dia_semana 
        };
    },

    remove: async (id) => {
        await db.query("DELETE FROM detalle_de_horario WHERE id_detalle_horario = ?", [id]);
        return { message: "Detalle de horario eliminado" };
    },
};