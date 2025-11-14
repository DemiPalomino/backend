import db from "../../config/db.js";

export const areasService = {
    getAll: async () => {
        try {
            console.log('🔍 Obteniendo todas las áreas...');
            const [rows] = await db.query(
                "SELECT a.*, s.nombre_sucursal FROM areas_de_trabajo a LEFT JOIN sucursales s ON a.id_sucursal = s.id_sucursal ORDER BY a.nombre_area"
            );
            console.log(`✅ ${rows.length} áreas encontradas`);
            return rows;
        } catch (error) {
            console.error('❌ Error en areasService.getAll:', error);
            throw new Error(`Error al obtener áreas: ${error.message}`);
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM areas_de_trabajo WHERE id_area = ?",
                [id]
            );
            if (rows.length === 0) {
                throw new Error('Área no encontrada');
            }
            return rows[0];
        } catch (error) {
            throw new Error(`Error al obtener área: ${error.message}`);
        }
    },

    create: async (areaData) => {
        try {
            console.log('📝 Creando área con datos:', areaData);
            const { nombre_area, descripcion, id_sucursal } = areaData;

            const [result] = await db.query(
                "INSERT INTO areas_de_trabajo (nombre_area, descripcion, id_sucursal) VALUES (?, ?, ?)",
                [nombre_area, descripcion, id_sucursal || null]
            );

            const nuevaArea = {
                id_area: result.insertId,
                nombre_area,
                descripcion,
                id_sucursal: id_sucursal || null
            };

            console.log('✅ Área creada con ID:', result.insertId);
            return nuevaArea;
        } catch (error) {
            console.error('❌ Error en areasService.create:', error);
            throw new Error(`Error al crear área: ${error.message}`);
        }
    },

    update: async (id, areaData) => {
        try {
            const { nombre_area, descripcion, id_sucursal } = areaData;

            console.log('📝 Actualizando área ID:', id, 'con datos:', areaData);

            await db.query(
                "UPDATE areas_de_trabajo SET nombre_area=?, descripcion=?, id_sucursal=? WHERE id_area=?",
                [nombre_area, descripcion, id_sucursal || null, id]
            );

            const [updatedRows] = await db.query(
                "SELECT * FROM areas_de_trabajo WHERE id_area = ?",
                [id]
            );

            return updatedRows[0];
        } catch (error) {
            console.error('Error en areasService.update:', error);
            throw new Error(`Error al actualizar área: ${error.message}`);
        }
    },

    remove: async (id) => {
        try {
            await db.query("DELETE FROM areas_de_trabajo WHERE id_area = ?", [id]);
            return { message: "Área eliminada correctamente" };
        } catch (error) {
            console.error('Error en areasService.remove:', error);
            throw new Error(`Error al eliminar área: ${error.message}`);
        }
    },
};
