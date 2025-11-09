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

    create: async ({ id, company, ruc, ubi}) => {
        //const contrasena = await bcrypt.hash(pass, 10);
        const [result] = await db.query(
            "INSERT INTO datos_de_la_empresa (id_empresa, nombre_empresa, ruc, direccion) VALUES (?, ?, ?, ?)",
            [id, company, ruc, ubi]
        );
        return { id, company, ruc, ubi };
    },

    update: async (id, {company, ruc, ubi}) => {
        let query = "UPDATE datos_de_la_empresa SET nombre_empresa=?, ruc=?, direccion=? WHERE id_empresa=?";
        let params = [company, ruc, ubi, id];

        await db.query(query, params);
        return { id, company, ruc, ubi };
    },

    remove: async (id) => {
        let query = "DELETE FROM datos_de_la_empresa WHERE id_empresa = ?";
        let params = [id];
        await db.query(query, params);

        //await db.query("DELETE FROM users WHERE id = ?", [id]); 
        return { message: "Datos de empresa eliminada" };
    },

};

