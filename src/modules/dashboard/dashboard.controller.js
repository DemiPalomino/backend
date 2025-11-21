import { dashboardService } from "./dashboard.service.js";

export const getEstadisticas = async (req, res) => {
    try {
        const user = req.user; // Asumiendo que el middleware auth añade el usuario
        const estadisticas = await dashboardService.getEstadisticas(
            user.id, 
            user.role, 
            user.id_persona
        );
        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEstadisticasEmpleado = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 2) {
            return res.status(403).json({ error: "Acceso no autorizado" });
        }
        
        const estadisticas = await dashboardService.getEstadisticasEmpleado(user.id_persona);
        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getReporteAsistencias = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, id_area } = req.query;
        const user = req.user;
        
        // Si es empleado, solo puede ver sus propias asistencias
        const idPersona = user.role === 2 ? user.id_persona : null;
        
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