import db from "../../config/db.js";

export const tipoUsuarioService = {
    getAll: async () => {
        const [rows] = await db.query("SELECT * FROM tipo_de_usuario ORDER BY nombre_tipo");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query("SELECT * FROM tipo_de_usuario WHERE id_tipo_usuario = ?", [id]);
        return rows[0];
    },

    create: async ({ nombre_tipo, descripcion}) => {
        const [result] = await db.query(
            "INSERT INTO tipo_de_usuario (nombre_tipo, descripcion) VALUES (?, ?)",
            [nombre_tipo, descripcion]
        );
        return { nombre_tipo, descripcion };
    },

    update: async (id, {nombre_tipo, descripcion}) => {
        let query = "UPDATE tipo_de_usuario SET nombre_tipo=?, descripcion=? WHERE id_tipo_usuario=?";
        let params = [nombre_tipo, descripcion, id];
        await db.query(query, params);
        return { id, nombre_tipo, descripcion };
    },

    remove: async (id) => {
        let query = "DELETE FROM tipo_de_usuario WHERE id_tipo_usuario = ?";
        let params = [id];
        await db.query(query, params);
        return { message: "Tipo de usuario eliminado" };
    },
};