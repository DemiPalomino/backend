import db from "../../config/db.js";

export const feriadoService = {
    getAll: async () => {
        const [rows] = await db.query("SELECT * FROM feriados ORDER BY fecha");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query("SELECT * FROM feriados WHERE id_feriado = ?", [id]);
        return rows[0];
    },

    create: async ({ fecha, des }) => {
        const [result] = await db.query(
            "INSERT INTO feriados (fecha, descripcion) VALUES (?, ?)",
            [fecha, des]
        );
        return { fecha, des };
    },

    update: async (id, {fecha, des}) => {
        let query = "UPDATE feriados SET fecha=?, descripcion=? WHERE id_feriado=?";
        let params = [fecha, des, id];

        await db.query(query, params);
        return { id, fecha, des };
    },

    remove: async (id) => {
        let query = "DELETE FROM feriados WHERE id_feriado = ?";
        let params = [id];
        await db.query(query, params);

        return { message: "Feriado eliminado" };
    },

};

