import { permisosService } from "./permisos.service.js";

export const getPermisos = async (req, res) => {
    try {
        const { id_persona } = req.query; 
        let permisos;
        
        if (id_persona) {
            permisos = await permisosService.getAll(parseInt(id_persona));
        } else {
            permisos = await permisosService.getAll();
        }
        
        res.json(permisos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPermiso = async (req, res) => {
    try {
        const permiso = await permisosService.getById(req.params.id);
        if (!permiso) return res.status(404).json({ error: "Permiso no encontrado" }); 
        res.json(permiso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPermiso = async (req, res) => {
    try {
        console.log(' Recibiendo solicitud de permiso:', req.body);
        const permiso = await permisosService.create(req.body);
        console.log('Permiso creado exitosamente:', permiso);
        res.status(201).json(permiso);
    } catch (error) {
        console.error('Error en createPermiso:', error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const updatePermiso = async (req, res) => {
    try {
        const permiso = await permisosService.update(req.params.id, req.body);
        res.json(permiso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePermiso = async (req, res) => {
    try {
        const result = await permisosService.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
