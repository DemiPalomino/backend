import db from "../../config/db.js";

export const areasService = {
    getAll: async () => {
        const [rows] = await db.query("SELECT id_area, nombre_area, descripcion FROM areas_de_trabajo");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query("SELECT id_area, nombre_area, descripcion FROM areas_de_trabajo WHERE id_area = ?", [id]);
        return rows[0];
    },

    create: async (areaData) => {
        const { id_area, nombre_area, descripcion } = areaData;
        
        // Validación
        if (!nombre_area) {
            throw new Error("El nombre del área es requerido");
        }

        const [result] = await db.query(
            "INSERT INTO areas_de_trabajo (id_area, nombre_area, descripcion) VALUES (?, ?, ?)",
            [id_area, nombre_area, descripcion]
        );
        
        return { id_area, nombre_area, descripcion };
    },

    update: async (id_area, { nombre_area, descripcion}) => {
        let query = "UPDATE areas_de_trabajo SET nombre_area=?, descripcion=? WHERE id_area=?";
        let params = [nombre_area, descripcion, id_area];
        await db.query(query, params);
        return { id_area, nombre_area, descripcion };
    },

    remove: async (id) => {
        let query = "DELETE FROM areas_de_trabajo WHERE id_area = ?";
        let params = [id];
        await db.query(query, params);
        return { message: "Area eliminada" };
    },
};
