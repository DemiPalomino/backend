import { dashboardService } from "./dashboard.service.js";

export const getEstadisticas = async (req, res) => {
    try {
        
        if (!req.user || !req.user.id_tipo_usuario) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        const estadisticas = await dashboardService.getEstadisticas(
            req.user.id_usuario, 
            req.user.id_tipo_usuario, 
            req.user.id_persona
        );
        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEstadisticasEmpleado = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }        
        const estadisticas = await dashboardService.getEstadisticasEmpleado(req.user.id_persona);
        
        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getReporteAsistencias = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, id_area } = req.query;
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }
        
        // Si es empleado, solo puede ver sus propias asistencias
        const idPersona = user.id_tipo_usuario === 2 ? user.id_persona : null;
        
        const reporte = await dashboardService.generarReporteAsistencias(
            fecha_inicio, 
            fecha_fin, 
            id_area, 
            idPersona
        );
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAreasConEmpleados = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        if (req.user.id_tipo_usuario !== 1) {
            return res.status(403).json({ error: "No autorizado" });
        }

        const areas = await dashboardService.getAreasConEmpleados();
        res.json(areas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};