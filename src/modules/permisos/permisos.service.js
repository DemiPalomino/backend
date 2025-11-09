import db from "../../config/db.js";

export const permisosService = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT pj.*, per.nombres, per.apellidos, per.dni 
            FROM permisos_justificaciones pj 
            INNER JOIN personas per ON pj.id_persona = per.id_persona
            ORDER BY pj.fecha_solicitud DESC`);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT pj.*, per.nombres, per.apellidos, per.dni 
            FROM permisos_justificaciones pj 
            INNER JOIN personas per ON pj.id_persona = per.id_persona 
            WHERE pj.id_permiso = ?`, [id]);
        return rows[0];
    },

    create: async ({ fechaSolicitud, fechaInicioAusencia, fechaFinAusencia, tipoPermiso, jus, estado, id_persona}) => {
        
        const [result] = await db.query(
            "INSERT INTO permisos_justificaciones (fecha_solicitud, fecha_inicio_ausencia, fecha_fin_ausencia, tipo_permiso, justificacion, estado, id_persona) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [fechaSolicitud, fechaInicioAusencia, fechaFinAusencia, tipoPermiso, jus, estado, id_persona]
        );
        return { fechaSolicitud, fechaInicioAusencia, fechaFinAusencia, tipoPermiso, jus, estado, id_persona};
    },

    update: async (id, {fechaSolicitud, fechaInicioAusencia, fechaFinAusencia, tipoPermiso, jus, estado, id_persona}) => {
        let query = "UPDATE permisos_justificaciones SET fecha_solicitud=?, fecha_inicio_ausencia=?, fecha_fin_ausencia=?, tipo_permiso=?, justificacion=?, estado=?, id_persona=?  WHERE id_permiso=?";
        let params = [fechaSolicitud, fechaInicioAusencia, fechaFinAusencia, tipoPermiso, jus, estado, id_persona, id];

        await db.query(query, params);
        return { id, fechaSolicitud, fechaInicioAusencia, fechaFinAusencia, tipoPermiso, jus, estado, id_persona };
    },

    remove: async (id) => {
        let query = "DELETE FROM permisos_justificaciones WHERE id_permiso = ?";
        let params = [id];
        await db.query(query, params);

        //await db.query("DELETE FROM users WHERE id = ?", [id]); 
        return { message: "Permiso eliminado" };
    },

};

