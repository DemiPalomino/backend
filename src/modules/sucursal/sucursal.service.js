import db from "../../config/db.js";

export const sucursalService = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT s.*, a.nombre_area 
            FROM sucursales s 
            LEFT JOIN areas_de_trabajo a ON s.id_area_trabajo = a.id_area 
            ORDER BY s.nombre_sucursal
        `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT s.*, a.nombre_area 
            FROM sucursales s 
            LEFT JOIN areas_de_trabajo a ON s.id_area_trabajo = a.id_area 
            WHERE s.id_sucursal = ?
        `, [id]);
        return rows[0];
    },

    create: async ({ nombre_sucursal, id_area_trabajo }) => {
        const [result] = await db.query(
            "INSERT INTO sucursales (nombre_sucursal, id_area_trabajo) VALUES (?, ?)",
            [nombre_sucursal, id_area_trabajo]
        );
        return { 
            id_sucursal: result.insertId, 
            nombre_sucursal, 
            id_area_trabajo 
        };
    },

    update: async (id, { nombre_sucursal, id_area_trabajo }) => {
        const query = "UPDATE sucursales SET nombre_sucursal=?, id_area_trabajo=? WHERE id_sucursal=?";
        const params = [nombre_sucursal, id_area_trabajo, id];
        
        await db.query(query, params);
        return { 
            id, 
            nombre_sucursal, 
            id_area_trabajo 
        };
    },

    remove: async (id) => {
        await db.query("DELETE FROM sucursales WHERE id_sucursal = ?", [id]);
        return { message: "Sucursal eliminada" };
    },
};