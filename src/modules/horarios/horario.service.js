import db from "../../config/db.js";

export const horarioService = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT h.*, a.nombre_area 
            FROM horario h 
            LEFT JOIN areas_de_trabajo a ON h.id_area_trabajo = a.id_area
        `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT h.*, a.nombre_area 
            FROM horario h 
            LEFT JOIN areas_de_trabajo a ON h.id_area_trabajo = a.id_area 
            WHERE h.id_horario = ?
        `, [id]);
        return rows[0];
    },

    create: async ({ nombre_horario, fecha_inicio, fecha_fin, id_area_trabajo }) => {
        const [result] = await db.query(
            "INSERT INTO horario (nombre_horario, fecha_inicio, fecha_fin, id_area_trabajo) VALUES (?, ?, ?, ?)",
            [nombre_horario, fecha_inicio, fecha_fin, id_area_trabajo]
        );
        return { 
            id_horario: result.insertId, 
            nombre_horario, 
            fecha_inicio, 
            fecha_fin, 
            id_area_trabajo 
        };
    },

    update: async (id, { nombre_horario, fecha_inicio, fecha_fin, id_area_trabajo }) => {
        const query = "UPDATE horario SET nombre_horario=?, fecha_inicio=?, fecha_fin=?, id_area_trabajo=? WHERE id_horario=?";
        const params = [nombre_horario, fecha_inicio, fecha_fin, id_area_trabajo, id];
        
        await db.query(query, params);
        return { 
            id, 
            nombre_horario, 
            fecha_inicio, 
            fecha_fin, 
            id_area_trabajo 
        };
    },

    remove: async (id) => {
        await db.query("DELETE FROM horario WHERE id_horario = ?", [id]);
        return { message: "Horario eliminado" };
    },
};