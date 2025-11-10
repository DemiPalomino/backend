import db from "../../config/db.js";

export const sucursalService = {
    getAll: async () => {
        try {
            console.log('🔍 Obteniendo todas las sucursales...');
            const [rows] = await db.query(`
                SELECT s.*, a.nombre_area 
                FROM sucursales s 
                LEFT JOIN areas_de_trabajo a ON s.id_area_trabajo = a.id_area 
                WHERE s.activo = 1
                ORDER BY s.nombre_sucursal
            `);
            console.log(`✅ ${rows.length} sucursales encontradas`);
            return rows;
        } catch (error) {
            console.error('❌ Error en sucursalService.getAll:', error);
            throw new Error(`Error al obtener sucursales: ${error.message}`);
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await db.query(`
                SELECT s.*, a.nombre_area 
                FROM sucursales s 
                LEFT JOIN areas_de_trabajo a ON s.id_area_trabajo = a.id_area 
                WHERE s.id_sucursal = ? AND s.activo = 1
            `, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error en sucursalService.getById:', error);
            throw new Error(`Error al obtener sucursal: ${error.message}`);
        }
    },

    create: async (sucursalData) => {
        try {
            console.log('📝 Creando sucursal con datos:', sucursalData);
            
            // ✅ CORREGIDO: Campos actualizados
            const { nombre_sucursal, direccion, telefono, id_area_trabajo } = sucursalData;
            
            const [result] = await db.query(
                "INSERT INTO sucursales (nombre_sucursal, direccion, telefono, id_area_trabajo, activo) VALUES (?, ?, ?, ?, 1)",
                [nombre_sucursal, direccion, telefono, id_area_trabajo || null]
            );
            
            const nuevaSucursal = {
                id_sucursal: result.insertId,
                nombre_sucursal,
                direccion,
                telefono,
                id_area_trabajo: id_area_trabajo || null,
                activo: 1
            };
            
            console.log('✅ Sucursal creada con ID:', result.insertId);
            return nuevaSucursal;
            
        } catch (error) {
            console.error('❌ Error en sucursalService.create:', error);
            throw new Error(`Error al crear sucursal: ${error.message}`);
        }
    },

    update: async (id, sucursalData) => {
        try {
            // ✅ CORREGIDO: Campos actualizados
            const { nombre_sucursal, direccion, telefono, id_area_trabajo } = sucursalData;
            
            await db.query(
                "UPDATE sucursales SET nombre_sucursal=?, direccion=?, telefono=?, id_area_trabajo=? WHERE id_sucursal=?",
                [nombre_sucursal, direccion, telefono, id_area_trabajo || null, id]
            );
            
            return { 
                id_sucursal: id,
                nombre_sucursal, 
                direccion, 
                telefono,
                id_area_trabajo: id_area_trabajo || null
            };
        } catch (error) {
            console.error('Error en sucursalService.update:', error);
            throw new Error(`Error al actualizar sucursal: ${error.message}`);
        }
    },

    remove: async (id) => {
        try {
            // ✅ CORREGIDO: Borrado lógico
            await db.query(
                "UPDATE sucursales SET activo = 0 WHERE id_sucursal = ?",
                [id]
            );
            return { message: "Sucursal eliminada correctamente" };
        } catch (error) {
            console.error('Error en sucursalService.remove:', error);
            throw new Error(`Error al eliminar sucursal: ${error.message}`);
        }
    },
};