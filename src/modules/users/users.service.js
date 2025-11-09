import db from "../../config/db.js";
import bcrypt from "bcryptjs";

export const userService = {
    getAll: async () => {
        const [rows] = await db.query("SELECT id_usuario, nombre_usuario, id_tipo_usuario, ultimo_acceso FROM usuarios");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query("SELECT id_usuario, nombre_usuario, id_tipo_usuario, ultimo_acceso FROM usuarios WHERE id_usuario = ?", [id]);
        return rows[0];
    },

    create: async ({ id, user, pass, tipo }) => {
        const contrasena = await bcrypt.hash(pass, 10);
        const [result] = await db.query(
            "INSERT INTO usuarios (id_usuario, nombre_usuario, contrasena, id_tipo_usuario) VALUES (?, ?, ?, ?)",
            [id, user, contrasena, tipo]
        );
        return { id, user, contrasena, tipo };
    },

    update: async (id, { usuario, password, tipo }) => {
        let query = "UPDATE usuarios SET nombre_usuario=?, id_tipo_usuario=? WHERE id_usuario=?";
        let params = [usuario, tipo, id];

        if (password) {
            const contrasena_encryptada = await bcrypt.hash(password, 10);
            query = "UPDATE usuarios SET nombre_usuario=?, contrasena=?, id_tipo_usuario=? WHERE id_usuario=?";
            params = [usuario, contrasena_encryptada, tipo, id];
        }

        await db.query(query, params);
        return { id, usuario, tipo };
    },

    remove: async (id) => {
        let query = "DELETE FROM usuarios WHERE id_usuario = ?";
        let params = [id];
        await db.query(query, params);

        return { message: "Usuario eliminado" };
    },


};

