import db from "../../config/db.js";

export const areasService = {
    getAll: async () => {
        try {
            console.log('🔍 Obteniendo todas las áreas...');
            const [rows] = await db.query("SELECT * FROM areas_de_trabajo ORDER BY nombre_area");
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
            return rows[0];
        } catch (error) {
            console.error('Error en areasService.getById:', error);
            throw new Error(`Error al obtener área: ${error.message}`);
        }
    },

    create: async (areaData) => {
        try {
            console.log('📝 Creando área con datos:', areaData);
            const { nombre_area, descripcion } = areaData;
            
            const [result] = await db.query(
                "INSERT INTO areas_de_trabajo (nombre_area, descripcion) VALUES (?, ?)",
                [nombre_area, descripcion]
            );
            
            const nuevaArea = {
                id_area: result.insertId,
                nombre_area,
                descripcion
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
            const { nombre_area, descripcion } = areaData;
            
            await db.query(
                "UPDATE areas_de_trabajo SET nombre_area=?, descripcion=? WHERE id_area=?",
                [nombre_area, descripcion, id]
            );
            
            return { 
                id_area: id,
                nombre_area, 
                descripcion 
            };
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
