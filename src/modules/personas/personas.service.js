import db from "../../config/db.js";

export const personaService = {
    getAll: async () => {
        const [rows] = await db.query("SELECT p.*, a.nombre_area FROM personas p LEFT JOIN areas_de_trabajo a ON p.id_area_trabajo = a.id_area");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query("SELECT p.*, a.nombre_area FROM personas p LEFT JOIN areas_de_trabajo a ON p.id_area_trabajo = a.id_area WHERE p.id_persona = ?", [id]);
        return rows[0];
    },

    create: async ({ dni, nombres, apellidos, email, phone, fecha_nace, id_area }) => {
        const [result] = await db.query(
            "INSERT INTO personas (dni, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, id_area_trabajo) VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE, ?)",
            [dni, nombres, apellidos, email, phone, fecha_nace, id_area]
        );
        return { dni, nombres, apellidos, email, phone, fecha_nace, id_area };
    },

    update: async (id, { dni, nombres, apellidos, email, phone, fecha_nace, id_area }) => {
        let query = "UPDATE personas SET dni=?, nombres=?, apellidos=?, email=?, telefono=?, fecha_nacimiento=?, id_area_trabajo=? WHERE id_persona=?";
        let params = [dni, nombres, apellidos, email, phone, fecha_nace, id_area, id];
        await db.query(query, params);
        return { id, dni, nombres, apellidos, email, phone, fecha_nace, id_area };
    },

    remove: async (id) => {
        let query = "DELETE FROM personas WHERE id_persona = ?";
        let params = [id];
        await db.query(query, params);
        return { message: "Persona eliminada" };
    },

    /* getConDescriptores: async () => {
        const [rows] = await db.query(`
            SELECT id_persona, nombres, apellidos, dni, descriptor_facial 
            FROM personas 
            WHERE activo = 1 AND descriptor_facial IS NOT NULL
        `);
        return rows;
    },

    actualizarDescriptor: async (id, descriptor_facial) => {
        await db.query(
            "UPDATE personas SET descriptor_facial = ?, fecha_actualizacion_rostro = NOW() WHERE id_persona = ?",
            [descriptor_facial, id]
        );
        return { message: "Descriptor facial actualizado" };
    }, */
};