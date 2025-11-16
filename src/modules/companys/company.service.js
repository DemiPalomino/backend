import db from "../../config/db.js";

export const companyService = {
    getAll: async () => {
        const [rows] = await db.query("SELECT id_empresa, nombre_empresa, ruc, direccion FROM datos_de_la_empresa");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query("SELECT id_empresa, nombre_empresa, ruc, direccion FROM datos_de_la_empresa WHERE id_empresa = ?", [id]);
        return rows[0];
    },

    create: async ({ id, nombre_empresa, ruc, direccion}) => {

        const [result] = await db.query(
            "INSERT INTO datos_de_la_empresa (id_empresa, nombre_empresa, ruc, direccion) VALUES (?, ?, ?, ?)",
            [id, nombre_empresa, ruc, direccion]
        );
        return { id, nombre_empresa, ruc, direccion };
    },

    update: async (id, {nombre_empresa, ruc, direccion}) => {
        let query = "UPDATE datos_de_la_empresa SET nombre_empresa=?, ruc=?, direccion=? WHERE id_empresa=?";
        let params = [nombre_empresa, ruc, direccion, id];

        await db.query(query, params);
        return { id, nombre_empresa, ruc, direccion };
    },

    remove: async (id) => {
        let query = "DELETE FROM datos_de_la_empresa WHERE id_empresa = ?";
        let params = [id];
        await db.query(query, params);
        
        return { message: "Datos de empresa eliminada" };
    },

};

